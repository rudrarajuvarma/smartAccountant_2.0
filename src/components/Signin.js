import React, { Component } from 'react';
import { Carousel, Input, Icon, Row, Col } from 'antd';
import '../index.css';
import axios from 'axios';
import one from '../images/screen_1.png';
import two from '../images/screen_2.png';
import three from '../images/screen_3.png';


const url = "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/"

var largeButtonStyles = {
    width: "100%",
    height: 30,
    backgroundColor: "#71a2f6",
}

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component: "signin",
            hiddenComponent: "signup",
            largeButtonColor: "#71a2f6",
            smallButtonColor: "#29a25a",
            userName: "",
            password: "",
            reEnterPassword: "",
        }
    }

    textFielseHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    largeButtonHandeling = (event) => {

        if (this.state.component === "signin") {

            if (this.state.userName !== "") {
                if (this.state.password !== "") {

             let self=this;
                    axios({
                        method: 'post',
                        url: url + "LoginValidations",
                        data: {
                            user_id: self.state.userName,
                            password: self.state.password,
                            status: "",
                            name: "",
                            role: "",
                            default_type: ""
                        },
    
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': "Basic " + btoa(self.state.userName + ":" + self.state.password),
                            'Content-Type': 'application/json'
                        },
                    })
    
                        .then(function (response) {
                            if (response.data.status != null) {
                                console.log("---res-rupee-",response.data);
                                localStorage.setItem('currency','&#8377;')
                                localStorage.setItem('signed_in_v2', "true");
                                localStorage.setItem('user_id_v2', response.data.status);
                                localStorage.setItem('user_name_v2',response.data.name);
                                localStorage.setItem('user_password_v2', btoa(self.state.userName + ":" + self.state.password))
                                localStorage.setItem('default_account_v2', response.data.default_type);
                                localStorage.setItem('component', "Calander");
                                self.props.history.push({ pathname: "/Home" })
                            }
                        })
                        .catch(e => {
                            alert("The user id or password you entered is incorrect. Please try again");
                        });

                }
                else {
                    alert("password field is empty")
                }
            }
            else {
                alert("email field is empty")
            }
        }

        else {
            this.props.history.push({ pathname: "/Home" })
        }
    }

    smallButtonHandeling = (event) => {

        if (this.state.component === "signin") {
            this.setState({ component: "signup", hiddenComponent: "signin", smallButtonColor: "#71a2f6", largeButtonColor: "#29a25a", })
        }
        else {
            this.setState({ component: "signin", hiddenComponent: "signup", smallButtonColor: "#29a25a", largeButtonColor: "#71a2f6", })
        }
    }

    render() {
        if (this.state.component === "signin") {
            largeButtonStyles.backgroundColor = "red"

        }
        // const butt = (
        //     <div>
        //         <button style={largeButtonStyles}>
        //             this is goinng to be changed</button>
        //     </div>
        // )

        return (
            <div>
                {/* {butt} */}
                <div className="components_body">

                    <Carousel autoplay>
                        <div ><img style={{ width: "100%" }} src={one} alt="--" /></div>
                        <div><img style={{ width: "100%" }} src={two} alt="--" /></div>
                        <div><img style={{ width: "100%" }} src={three} alt="--" /></div>
                    </Carousel>

                    <div style={{ marginTop: 30 }}>
                        <Row>
                            <Col span={4}></Col>
                            <Col span={16}>
                                <Input
                                    id="signin"
                                    name="userName"
                                    autocomplete="off"
                                    style={{ fontSize: 18 }}
                                    value={this.state.userName}
                                    onChange={this.textFielseHandler}
                                    placeholder="Enter your username"
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                />
                            </Col>
                            <Col span={4}></Col>
                        </Row>
                    </div>
                    <div style={{ marginTop: 8, }}>
                        <Row>
                            <Col span={4}></Col>
                            <Col span={16}>
                                <Input
                                    id="signin"
                                    name="password"
                                    style={{ fontSize: 18 }}
                                    value={this.state.password}
                                    onChange={this.textFielseHandler}
                                    type="password"
                                    placeholder="Password"
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                />
                            </Col>
                            <Col span={4}></Col>
                        </Row>
                    </div>

                    {(this.state.component === "signup") ?
                        <div style={{ marginTop: 8, }}>
                            <Row>
                                <Col span={4}></Col>
                                <Col span={16}>
                                    <Input
                                        name="reEnterPassword"
                                        style={{ fontSize: 18 }}
                                        value={this.state.reEnterPassword}
                                        onChange={this.textFielseHandler}
                                        type="password"
                                        placeholder="Re enter passsword"
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    />
                                </Col>
                                <Col span={4}></Col>
                            </Row>
                        </div>
                        : null
                    }

                    <div style={{ marginTop: 20, }}>
                        <Row>
                            <Col span={4}></Col>
                            <Col span={16}>
                                <button onClick={this.largeButtonHandeling} id="signin" style={{ backgroundColor: this.state.largeButtonColor }}>{this.state.component}</button>
                            </Col>
                            <Col span={4}></Col>
                        </Row>
                    </div>
{/*                     
                    <div style={{ marginTop: 20, marginBottom: 20 }}>
                        <Row>
                            <Col span={4}></Col>
                            <Col span={16}>
                                <button onClick={this.smallButtonHandeling} id="signin" style={{ backgroundColor: this.state.smallButtonColor }}>{this.state.hiddenComponent}</button>
                            </Col>
                            <Col span={4}></Col>
                        </Row>
                    </div> */}
                </div>
            </div>
        )

    }
}

export default (Signin);