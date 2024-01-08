package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	Routers()
}

func Routers() {
	InitDB()
	defer db.Close()
	log.Println("Starting the HTTP server on port 9080")
	router := mux.NewRouter()
	router.HandleFunc("/users",
		GetUsers).Methods("GET")
	router.HandleFunc("/users",
		CreateUser).Methods("POST")
	router.HandleFunc("/users/{id}",
		GetUser).Methods("GET")
	router.HandleFunc("/users/{id}",
		UpdateUser).Methods("PUT")
	router.HandleFunc("/users/{id}",
		DeleteUser).Methods("DELETE")
	http.ListenAndServe(":9080",
		&CORSRouterDecorator{router})
}

/***************************************************/

// Get all users
func GetUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var users []User

	result, err := db.Query("SELECT id, date, description, amount, status, receiver, jk, no_telp, address from transaksi_keuangansalsabilahusaini")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var user User
		err := result.Scan(&user.ID, &user.Date,
			&user.Description, &user.Amount, &user.Status, &user.Receiver, &user.Jk, &user.No_telp, &user.Address)
		if err != nil {
			panic(err.Error())
		}
		users = append(users, user)
	}
	json.NewEncoder(w).Encode(users)
}

// Create user
func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	stmt, err := db.Prepare("INSERT INTO transaksi_keuangansalsabilahusaini(date," +
		"description,amount,status,receiver,jk, no_telp,address) VALUES(?,?,?,?,?,?,?,?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	date := keyVal["date"]
	description := keyVal["description"]
	amount := keyVal["amount"]
	status := keyVal["status"]
	receiver := keyVal["receiver"]
	jk := keyVal["jk"]
	no_telp := keyVal["no_telp"]
	address := keyVal["address"]
	// print jenis_kelamin
	fmt.Println(jk)
	fmt.Println(status)
	_, err = stmt.Exec(date, description, amount, status, receiver, jk, no_telp, address)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "transaksi berhasil diinput")
}

// Get user by ID
func GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	result, err := db.Query("SELECT id, date,"+
		"description,amount,status,receiver,jk, no_telp,address from transaksi_keuangansalsabilahusaini WHERE id = ?", params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var user User
	for result.Next() {
		err := result.Scan(&user.ID, &user.Date,
			&user.Description, &user.Amount, &user.Status, &user.Receiver, &user.Jk, &user.No_telp, &user.Address)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(user)
}

// Update user
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	stmt, err := db.Prepare("UPDATE transaksi_keuangansalsabilahusaini SET date= ?, description=?, amount=?, status=?, receiver=?, jk=?, no_telp=?, address=? WHERE id = ?")

	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	date := keyVal["date"]
	description := keyVal["description"]
	amount := keyVal["amount"]
	status := keyVal["status"]
	receiver := keyVal["receiver"]
	jk := keyVal["jk"]
	no_telp := keyVal["no_telp"]
	address := keyVal["address"]
	_, err = stmt.Exec(date, description, amount, status, receiver, jk, no_telp, address, params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "User with ID = %s was updated",
		params["id"])
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	// stmt, err := db.Prepare("DELETE FROM users WHERE id = ?")
	stmt, err := db.Prepare("DELETE FROM transaksi_keuangansalsabilahusaini WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	_, err = stmt.Exec(params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "User with ID = %s was deleted",
		params["id"])
}

type User struct {
	ID          int    `json:"id"`
	Date        string `json:"date"`
	Description string `json:"description"`
	Amount      string `json:"amount"`
	Status      string `json:"status"`
	Receiver    string `json:"receiver"`
	Jk          string `json:"jk"`
	No_telp     string `json:"no_telp"`
	Address     string `json:"address"`
}

var db *sql.DB
var err error

func InitDB() {
	db, err = sql.Open("mysql",
		"root:@tcp(127.0.0.1:3306)/db_2210006_salsabilahusaini_uas_pilkomb")
	fmt.Println("connected to db")
	if err != nil {
		panic(err.Error())
	}
}

/***************************************************/

// CORSRouterDecorator applies CORS headers to a mux.Router
type CORSRouterDecorator struct {
	R *mux.Router
}

func (c *CORSRouterDecorator) ServeHTTP(rw http.ResponseWriter,
	req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods",
			"POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers",
			"Accept, Accept-Language,"+
				" Content-Type, YourOwnHeader")
	}
	// Stop here if its Preflighted OPTIONS request
	if req.Method == "OPTIONS" {
		return
	}

	c.R.ServeHTTP(rw, req)
}
