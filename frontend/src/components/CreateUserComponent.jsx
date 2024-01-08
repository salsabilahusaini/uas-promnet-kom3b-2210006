import React, { Component } from 'react';
import UserService from "../services/UserService";
import Swal from "sweetalert2"

class CreateUserComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // step 2
      id: this.props.match.params.id,
      date: "",
      description: "",
      amount: "",
      status: "",
      receiver: "",
      jk: "",
      no_telp: "",
      address: "",
    };
    this.changedate = this.changedate.bind(this);
    this.changedescription = this.changedescription.bind(this);
    this.changeamount = this.changeamount.bind(this);
    this.changestatus = this.changestatus.bind(this);
    this.changereceiver = this.changereceiver.bind(this);
    this.changejk = this.changejk.bind(this);
    this.changeno_telp = this.changeno_telp.bind(this);
    this.changeaddress = this.changeaddress.bind(this);
    this.saveOrUpdateUser = this.saveOrUpdateUser.bind(this);
  }

  // step 3
  componentDidMount() {
    // step 4
    if (this.state.id === "_add") {
      return;
    } else {
      UserService.getUserById(this.state.id).then((res) => {
        let user = res.data;
        this.setState({
          date: user.date,
          description: user.description,
          amount: user.amount,
          status: user.status,
          receiver: user.receiver,
          jk: user.jk,
          no_telp: user.no_telp,
          address: user.address,
        });
      });
    }
  }

saveOrUpdateUser = (e) => {
  e.preventDefault();
  let user = {
    date: this.state.date,
    description: this.state.description,
    amount: this.state.amount,
    status: this.state.status,
    receiver: this.state.receiver,
    jk: this.state.jk,
    no_telp: this.state.no_telp,
    address: this.state.address,
  };
  console.log("user => " + JSON.stringify(user));

  // step 5
  if (this.state.id === "_add") {
    UserService.createUser(user).then((res) => {
      // Menampilkan notifikasi setelah berhasil menambahkan data
      this.props.history.push("/users");
      Swal.fire(
        'Added Successfully!',
        'You clicked the button!',
        'success'
      )
    });
  } else {
    UserService.updateUser(user, this.state.id).then((res) => {
      // Menampilkan notifikasi setelah berhasil memperbarui data
      this.props.history.push("/users");
      Swal.fire(
        'Successfully Updated!',
        'You clicked the button!',
        'success'
      )
    });
  }
};


  changedate = (event) => {
    this.setState({ date: event.target.value });
  };

  changedescription = (event) => {
    this.setState({ description: event.target.value });
  };

  changeamount = (event) => {
    this.setState({ amount: event.target.value });
  };

  changestatus = (event) => {
    this.setState({ status: event.target.value });
  };

  changereceiver = (event) => {
    console.log(event.target.value);
    this.setState({ receiver: event.target.value });
  };

  changejk = (event) => {
    this.setState({ jk: event.target.value });
  };

  changeno_telp = (event) => {
    this.setState({ no_telp: event.target.value });
  };

  changeaddress = (event) => {
    this.setState({ address: event.target.value });
  };

  cancel() {
    this.props.history.push("/users");
  }

  getTitle() {
    if (this.state.id === "_add") {
      return <h3 className="text-center">Add transaction</h3>;
    } else {
      return <h3 className="text-center">Update transaction</h3>;
    }
  }

  render() {
    return (
      <div>
        <br></br>
        <div className="container">
          <div className="row">
            <div className="card col-md-6 offset-md-3 offset-md-3">
              {this.getTitle()}
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label> Date: </label>
                    <input
                      type="date"
                      placeholder="date"
                      name="date"
                      className="form-control"
                      value={this.state.date}
                      onChange={this.changedate}
                    />
                  </div>
                  <div className="form-group">
                    <label> Description: </label>
                    <input
                      placeholder="description"
                      name="description"
                      className="form-control"
                      value={this.state.description}
                      onChange={this.changedescription}
                    />
                  </div>
                  <div className="form-group">
                    <label> Amount: </label>
                    <input
                      placeholder="amount"
                      name="amount"
                      className="form-control"
                      value={this.state.amount}
                      onChange={this.changeamount}
                    />
                  </div>
                  <div className="form-group">
                    <label> Status: </label>
                    <select
                      name="status"
                      className="form-control"
                      value={this.state.status}
                      onChange={this.changestatus}
                    >
                      <option>....</option>
                      <option value="debit">Debit</option>
                      <option value="kredit">Kredit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label> Receiver: </label>
                    <input
                      placeholder="receiver"
                      name="receiver"
                      className="form-control"
                      value={this.state.receiver}
                      onChange={this.changereceiver}
                    />
                  </div>
                  <div className="form-group">
                    <label> Jenis Kelamin: </label>
                    <select
                      name="jk"
                      className="form-control"
                      value={this.state.jk}
                      onChange={this.changejk}
                    >
                      <option>....</option>
                      <option value="l">Laki-Laki</option>
                      <option value="p">Perempuan</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label> No Telepon: </label>
                    <input
                      placeholder="no_telp"
                      name="no_telp"
                      className="form-control"
                      value={this.state.no_telp}
                      onChange={this.changeno_telp}
                    />
                  </div>
                  <div className="form-group">
                    <label> Address: </label>
                    <input
                      placeholder="address"
                      name="address"
                      className="form-control"
                      value={this.state.address}
                      onChange={this.changeaddress}
                    />
                  </div>

                  <button
                    className="btn btn-success"
                    onClick={this.saveOrUpdateUser}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={this.cancel.bind(this)}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateUserComponent;
