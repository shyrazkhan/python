pragma solidity ^0.4.0;

contract Authenticate {
    
     address owner;
     mapping(address => User) Users;
     mapping(address => bool) LoggedUsers;
     
    
    struct User {
        string firstName;
        string lastName;
        string username;
        string password;
        bool islogin;
        bool registered;
    }
    
    constructor()  {
        owner = msg.sender;
    }
    
    
    function registerUser(string firstName, string lastName, string username, string password) public returns (bool success) {
       
        Users[msg.sender] = (User({
            firstName: firstName,
            lastName:  lastName,
            username:  username,
            password:  password,
            islogin:   false,
            registered: true
        }));
        return true;
    }
    
    function checkUserExists() public view returns (bool exists) {
        require(Users[msg.sender].registered);
        return true;
    }
    
    function getUserDetails() public view returns (string userInfo) {
            string memory first = Users[msg.sender].firstName;
            string memory last = Users[msg.sender].lastName;
            string memory user = Users[msg.sender].username;
            string memory pwd = Users[msg.sender].password;
            string memory abiUser = string(abi.encodePacked(first, ":", last, ":", user, ":", pwd));
            return abiUser;
    }
    
    
    
    
    
    
    
}