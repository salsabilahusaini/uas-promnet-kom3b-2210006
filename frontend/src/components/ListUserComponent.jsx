import React, { Component } from 'react';
import UserService from '../services/UserService';
import Swal from "sweetalert2"
import { Button } from 'react-bootstrap';

class ListUserComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
                users: [],
                searchTerm: '',
        };
        this.addUser = this.addUser.bind(this);
        this.editUser = this.editUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    deleteUser(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will delete it',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                UserService.deleteUser(id).then(res => {
                    this.setState({
                        users: this.state.users.filter(user => user.id !== id)
                    });
                    Swal.fire(
                        'Deleted!',
                        'User has been deleted.',
                        'success'
                    );
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'User deletion cancelled :)',
                    'error'
                );
            }
        });
    }

    viewUser(id){
        this.props.history.push(`/view-user/${id}`);
    }
    editUser(id){
        this.props.history.push(`/add-user/${id}`);
    }

    componentDidMount(){
        UserService.getUsers().then((res) => {
            if(res.data==null)
            {
                this.props.history.push('/add-user/_add');
            }
            this.setState({ users: res.data});
        });
    }

    addUser() {
        this.props.history.push('/add-user/_add');
    }

    handleSearchChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    getFilteredUsers() {
        const { users, searchTerm } = this.state;

        return users.filter(
            (user) =>
                user.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.receiver.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }


    render() {
        return (
            <div>
                 <h2 className="text-center">Financial Data</h2>
                 <div className = "row">
                    <Button variant="outline-info"
                     onClick={this.addUser}> Add User</Button>
                 </div>
                 <br></br>
                 <div className= "row">
                 <input
                        type="text"
                        placeholder="name or description"
                        value={this.state.searchTerm}
                        title="search by receiver or description"
                        onChange={(e) => this.handleSearchChange(e)}
                        style={{ fontStyle: 'italic' }}
                    />
                 </div>
                 <br></br>
                 <div className = "list row">
                        <table className 
                        = "table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Receiver</th>
                                    <th>JK</th>
                                    <th>No Telepon</th>
                                    <th>Address</th>
                                    <th>Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.getFilteredUsers().map((user) => (
                                <tr key={user.id}>
                                    <td>{user.date}</td>
                                    <td>{user.description}</td>
                                    <td>Rp.{user.amount}</td>
                                    <td>{user.status}</td>
                                    <td>{user.receiver}</td>
                                    <td>{user.jk}</td>
                                    <td>{user.no_telp}</td>
                                    <td>{user.address}</td>
                                    <td>
                      <button onClick={ () => 
                          this.editUser(user.id)} 
                               className="btn btn-info">Update 
                                 </button>
                       <button style={{marginLeft: "10px"}}
                          onClick={ () => this.deleteUser(user.id)} 
                             className="btn btn-danger">Delete 
                                 </button>
                       <button style={{marginLeft: "10px"}} 
                           onClick={ () => this.viewUser(user.id)}
                              className="btn btn-info">View 
                                  </button>
                                    </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                 </div>
            </div>
        )
    }
}

export default ListUserComponent
