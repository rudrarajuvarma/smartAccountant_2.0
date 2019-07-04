import React, { Component } from 'react';
import '../index.css';
import { Drawer, Row, Col, Icon, Modal, Calendar } from 'antd';
import menu from '../images/menu.png';
import calendar from '../images/calendar.png'
import bill from '../images/bill.png';
import budget from '../images/budget.png'
import chart from '../images/chart.png'
import calendar_1 from '../images/calendar_1.png'
import bill_1 from '../images/bill_1.png';
import budget_1 from '../images/budget_1.png'
import chart_1 from '../images/chart_1.png'
import categoryicon from '../images/categoryicon.png'
import profileicon from '../images/profileicon.png'
import moneyicon from '../images/money.png'
import downArrow from '../images/down-arrow.png'
import Chart from './Chart';
import Bills from './Bills';
import Budget from './Budget';
import Calender from './Calander';
import Show_categories from './Show_categories';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import Calander from './Calander';
import axios from 'axios';

const footerCilStyles = { height: 50, margin: "auto", paddingTop: 5 }
const footerCilStylesText = { height: 50, margin: "auto", paddingTop: 5 }

class Home extends Component {
    constructor(props) {    
        super(props);
        this.state = {
            user_password: localStorage.getItem('user_password_v2'),
            profilePic: profileicon,
            component: Calander,
            calendar: calendar_1,
            chart: chart,
            budget: budget,
            bill: bill,
            showSettingsDrawer: false,
            showSettings_iconsDrawer: false,
            showSettings_currencyDrawer: false,
            showSignoutModel: false,
            incomeOrExpense: "Expense",
            categoriesOraddCategory: "category",
            userDetails: [],
        }
        this.takePicture = this.takePicture.bind(this);
    }

    componentWillMount() {

        if (window.sessionStorage.getItem('component') === "Calander") {
            this.setState({ component: Calander })
            this.changeComponentToCalendar()
        }
        else if (window.sessionStorage.getItem('component') === "Bills") {
            this.setState({ component: Bills })
            this.changeComponentToBills()
        }
        else if (window.sessionStorage.getItem('component') === "Chart") {
            this.setState({ component: Chart })
            this.changeComponentToChart()
        }

        else if (window.sessionStorage.getItem('component') === "Budget"){
          
            this.setState({ component: Budget })
            this.changeComponentToBudget()
        }
        axios({
            method: 'get',
            url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Ac_Details('" + localStorage.getItem('user_name_v2') + "')",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': "Basic " + this.state.user_password,
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                console.log("---------axios---------", response.data.value)
            })
    }

    async takePicture() {

        let self = this;
        
        const { Camera } = Plugins;
        const image = await Camera.getPhoto({
            quality: 20,
            resultType: CameraResultType.Base64
        });
        var imageUrl = "data:image/png;base64," + image.base64String;
        self.setState({ profilePic: imageUrl });

var data_users=this.state.userDetails

data_users.attachment=imageUrl

        axios({
            method: 'put',
            url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Ac_Details('"+this.state.userDetails.Autoid+"')",
            data:data_users,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': "Basic " + this.state.user_password,
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                self.settingsButtonHandler()
            })
       

    }

    showCurrencyScreen = () => {
        this.setState({ showSettings_currencyDrawer: true, })
    }

    changeComponentToChart = (e) => {
        this.setState({ component: Chart, calendar: calendar, chart: chart_1, bill: bill, budget: budget })
    }

    changeComponentToCalendar = (e) => {
        this.setState({ component: Calender, calendar: calendar_1, chart: chart, bill: bill, budget: budget })
    }

    changeComponentToBills = (e) => {
        this.setState({ component: Bills, calendar: calendar, chart: chart, bill: bill_1, budget: budget })
    }

    changeComponentToBudget = (e) => {
        this.setState({ component: Budget, calendar: calendar, chart: chart, bill: bill, budget: budget_1 })
    }

    showCategeryScreen = () => {
        this.setState({ showSettings_iconsDrawer: true })
    }

    hideCategeryScreen = () => {
        this.setState({ showSettings_iconsDrawer: false, showSettings_currencyDrawer: false })
    }

    addDetailsButtonHandler = () => {
        this.props.history.push({
            pathname: "/Add_details",
            state: { edit: "NotEdit" }
        })
        localStorage.setItem("edit", "NotEdit")
    }

    settingsButtonHandler = () => {
        this.setState({ showSettingsDrawer: true })

        if (this.state.userDetails.length == 0) {
            let self = this;
            axios({
                method: 'get',
                url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Ac_Details",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Basic " + this.state.user_password,
                    'Content-Type': 'application/json',
                },
            })
                .then(function (response) {
                    console.log("--------", response.data);
                    self.setState({ userDetails: response.data.value[0] })
                })
        }
    }

    hideSettingsDrawerHandler = () => {
        this.setState({ showSettingsDrawer: false })
    }

    signOutHandelar = () => {
        this.setState({ showSignoutModel: true })
    }

    signoutFunctionHandler = () => {
        localStorage.setItem('signed_in_v2', "false");
        this.props.history.push({ pathname: "/Signin" })
    }

    hideSignoutModel = () => {
        this.setState({ showSignoutModel: false })
    }

    editCategoryHandler = (item) => {
        this.setState({ editCategoryArray: item, categoriesOraddCategory: "addCategory" })
    }

    render() {
        return (
            <div>
                <div className="components_body">
                    <div>
                        <this.state.component
                            menuOpenerHandler={this.settingsButtonHandler}
                            history={this.props.history}
                        />
                    </div>
                    {/* ----------------------------------------------footer----------------------------------------------------- */}
                    <div className="footer_div">
                        <Row >
                            <Col span={1}></Col>
                            <Col span={4} style={footerCilStyles} onClick={() => this.changeComponentToCalendar()}>
                                <Row>
                                    <Col span={24} style={footerCilStyles}>
                                        <img src={this.state.calendar} alt="calendar" width="30px" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24} style={footerCilStylesText}>
                                        <p style={{ fontSize: 12 }}>calendar</p>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={4} style={footerCilStyles} onClick={() => this.changeComponentToChart()}>
                                <Row>
                                    <Col span={24} style={footerCilStyles} >
                                        <img src={this.state.chart} alt="Chart" width="30px" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24} style={footerCilStylesText}>
                                        <p style={{ fontSize: 12 }}>chart</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6} style={{ paddingTop: 10 }} onClick={this.addDetailsButtonHandler}>
                                <button id="addDeteails">
                                    <Icon type="plus" style={{ fontSize: 38, color: "#ffffff" }} />
                                </button>
                            </Col>
                            <Col span={4} style={footerCilStyles} onClick={() => this.changeComponentToBudget()}>

                                <Row>
                                    <Col span={24} style={footerCilStyles}>
                                        <img src={this.state.budget} alt="Budget" width="30px" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24} style={footerCilStylesText}>
                                        <p style={{ fontSize: 12 }}>budget</p>
                                    </Col>
                                </Row>

                            </Col>
                            <Col span={4} style={footerCilStyles} onClick={() => this.changeComponentToBills()}>

                                <Row>
                                    <Col span={24} style={footerCilStyles}>
                                        <img src={this.state.bill} alt="Bills" width="30px" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24} style={footerCilStylesText}>
                                        <p style={{ fontSize: 12 }}>bills</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={1}></Col>
                        </Row>

                    </div>

                    {/* ---------------------------settinsDrawer-------------------------------------------- */}

                    <div className="settingsDiv">
                        <Drawer
                            placement="bottom"
                            height={window.innerHeight}
                            closable={false}
                            onClose={this.hideSettingsDrawerHandler}
                            visible={this.state.showSettingsDrawer}
                        >
                            <div>
                                <Row className="header" style={{ paddingTop: 15 }}>
                                    <Col span={1} ></Col>
                                    <Col span={3} onClick={this.hideSettingsDrawerHandler}><img src={downArrow} width="25px" /></Col>
                                    <Col span={16} ><h2>Settings</h2></Col>
                                    <Col span={4}></Col>
                                </Row>
                                <hr />
                                <div style={{ padding: 10, textAlign: "center", }}>
                                    <Row className="settingsRows">
                                        <Col span={1}></Col>
                                        <Col span={5} onClick={this.takePicture}><img style={{ borderRadius: 50 }} src={profileicon} alt="category_icon" width="50px" height="50px" /></Col>
                                                                                       {/* src={this.state.userDetails.attachment} */}
                                        <Col span={3}></Col>
                                        <Col span={10} style={{ textAlign: "left" }}>{this.state.userDetails.emailid}<br />{this.state.userDetails.mobile_no}</Col>
                                        <Col span={4} >
                                        </Col>
                                    </Row>
                                    <hr />

                                    <Row className="settingsRows" onClick={this.showCategeryScreen} >
                                        <Col span={1}></Col>
                                        <Col span={5}><img src={categoryicon} alt="category_icon" width="26px" /></Col>
                                        <Col span={3}></Col>
                                        <Col span={10} style={{ textAlign: "left" }}><span style={{ fontSize: "120%" }}>Category</span></Col>
                                        <Col span={4}

                                            style={{ fontSize: "120%", color: "#c8c8c8", fontWeight: "bold", textAlign: "right" }}><Icon type="right" /></Col>
                                        <Col span={1}></Col>
                                    </Row>
                                    <hr />

                                    <Row className="settingsRows" onClick={this.showCurrencyScreen} >
                                        <Col span={1}></Col>
                                        <Col span={5}><img src={moneyicon} alt="moneyicon" width="26px" /></Col>
                                        <Col span={3}></Col>
                                        <Col span={10} style={{ textAlign: "left" }}><span style={{ fontSize: "120%" }}>Currency</span></Col>
                                        <Col span={4}

                                            style={{ textAlign: "right", fontSize: "120%", color: "#c8c8c8", fontWeight: "bold" }}><Icon type="right" /></Col>
                                        <Col span={1}></Col>
                                    </Row>
                                    <hr />

                                    <Row style={{ position: "fixed", bottom: 10, left: 0, color: "red", }}>
                                        <Col span={8}></Col>
                                        <Col span={8} onClick={this.signOutHandelar} style={{ padding: 10 }}>
                                            <span> sign out</span>
                                        </Col>
                                        <Col span={8}></Col>
                                    </Row>
                                </div>
                            </div>
                        </Drawer>

                        {/* ------------------------ ------------------------showIconsDrawer--------------------------- */}
                        <Drawer
                            placement="right"
                            height={window.innerHeight}
                            width={"100%"}
                            closable={false}
                            onClose={this.hideCategeryScreen}
                            visible={this.state.showSettings_iconsDrawer}
                        >
                            <Show_categories
                                backToHomeComponant={this.hideCategeryScreen}
                            />
                        </Drawer>

                        <Drawer
                            placement="right"
                            height={window.innerHeight}
                            width={"100%"}
                            closable={false}
                            onClose={this.hideCategeryScreen}
                            visible={this.state.showSettings_currencyDrawer}
                        >

                            <div>
                                <hr />
                                <div style={{ textAlign: "center", }}>
                                    <Row style={{ height: 60 }}>
                                        <Col span={1} ></Col>
                                        <Col span={3} onClick={this.hideCategeryScreen}><Icon type="left" style={{ fontSize: 20, marginTop: 20 }} /></Col>
                                        <Col span={16} style={{ marginTop: 12 }}><h2>Currency</h2></Col>
                                        <Col span={4}></Col>
                                    </Row>
                                    <hr />

                                    <div style={{ padding: 10 }}>
                                        <Row style={{ height: 50, }}>
                                            <Col span={1} ></Col>
                                            <Col span={3} style={{ fontSize: "150%", paddingTop: 8 }}>&#8377;</Col>
                                            <Col span={1}></Col>
                                            <Col span={16} style={{ paddingTop: 11, textAlign: "left" }}>Indian Rupee</Col>
                                            <Col span={3}></Col>
                                        </Row>
                                        <hr />
                                        <Row style={{ height: 50, }}>
                                            <Col span={1} ></Col>
                                            <Col span={3} style={{ fontSize: "150%", paddingTop: 8 }}>&#163;</Col>
                                            <Col span={1}></Col>

                                            <Col span={16} style={{ paddingTop: 14, textAlign: "left" }}>Pound</Col>
                                            <Col span={3}></Col>
                                        </Row>
                                        <hr />
                                        <Row style={{ height: 50, }}>
                                            <Col span={1} ></Col>
                                            <Col span={3} style={{ fontSize: "150%", paddingTop: 8 }}>&#36;</Col>
                                            <Col span={1} ></Col>
                                            <Col span={16} style={{ paddingTop: 14, textAlign: "left" }}>US Dollar</Col>
                                            <Col span={3}></Col>
                                        </Row>
                                        <hr />

                                        <Row style={{ height: 50, }}>
                                            <Col span={1} ></Col>
                                            <Col span={3} style={{ fontSize: "150%", paddingTop: 8 }}>&euro;</Col>
                                            <Col span={1} ></Col>
                                            <Col span={16} style={{ paddingTop: 14, textAlign: "left" }}>Euro</Col>
                                            <Col span={3}></Col>
                                        </Row>
                                        <hr />

                                    </div>

                                </div>
                            </div>
                        </Drawer>
                    </div>

                    <div>
                        <Modal
                            visible={this.state.showSignoutModel}
                            onOk={this.signoutFunctionHandler}
                            onCancel={this.hideSignoutModel}
                        >
                            <p>Are you sure you want to log out...</p>
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}
export default (Home);  