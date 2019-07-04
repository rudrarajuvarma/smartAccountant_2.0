
import React, { Component } from 'react';
import { Drawer, Row, Col, Icon } from 'antd';
import menu from '../images/menu.png';
import calendar from '../images/calendar.png'
import { Input } from 'antd';
import { Swipeable } from 'react-swipeable'
import { DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Empty } from 'antd';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const daysStyle = {
    marginRight: 3
}

class Calander extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            dates: [],
            selectedDateIndex: "",
            displayingData: [],
            searchDisplayingData: [],
            toggle: false,
            showSearchDrawer: false,
            heightOfDrawer: (window.innerHeight),
            user_password: localStorage.getItem('user_password_v2'),
            totalIncomeOfday: 0,
            totalExpenseOfday: 0,
            searchDataTextField: "",
        }
    }

    componentWillMount(arg) {

        window.sessionStorage.setItem('component', "Calander");

        this.setState({ displayingData: [], totalIncomeOfday: 0, totalExpenseOfday: 0 })
        if (arg === undefined) {
            var startDate = new Date()
        }
        else {
            var startDate = new Date(arg)
        }

        this.setState({ selectedDateIndex: new Date(startDate).getDay(), date: new Date(startDate) });

        var monthConvertStart = (startDate.getMonth() + 1)
        if (Number(monthConvertStart) < 10) { monthConvertStart = "0" + String(monthConvertStart) }

        // var monthConvertEnd = (startDate.getMonth() + 1)
        // if (Number(monthConvertEnd) < 10) { monthConvertEnd = "0" + String(monthConvertEnd) }

        var dateDate = startDate.getDate()
        if (Number(dateDate) < 10) { dateDate = "0" + String(dateDate) }

        // var dateDatend = (startDate.getDate() + 1)
        // if (Number(dateDatend) < 10) { dateDatend = "0" + String(dateDatend)}

        var sd = startDate.getFullYear() + "-" + monthConvertStart + "-" + dateDate;
        // var ed = startDate.getFullYear() + "-" + monthConvertEnd + "-" + dateDatend;

        sd = String(sd)
        // ed = String(ed)

        var urlData = "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/PersonalAccs?$filter=date le '" + sd + "' and date ge '" + sd + "'"
        console.log("--------url-------", urlData)

        let self = this;
        axios({
            method: 'get',
            url: urlData,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': "Basic " + this.state.user_password,
                'Content-Type': 'application/json'
            },
        })
            .then(function (response) {

                const ExpArr = response.data.value.filter(item => item.type === "Expense");
                const IncArr = response.data.value.filter(item => item.type === "Income");

                let dayTotalIncome = IncArr.reduce((total, item) => Number(total) + Number(item.amount), 0);
                let dayTotalExpense = ExpArr.reduce((total, item) => Number(total) + Number(item.amount), 0);

                self.setState({ displayingData: response.data.value, totalIncomeOfday: dayTotalIncome, totalExpenseOfday: dayTotalExpense })
            })

        let datesArray = []
        startDate.setDate(startDate.getDate() - startDate.getDay());
        for (let i = 0; i < 7; i++) {
            if (i === 0) {
                datesArray.push(new Date(startDate.setDate(startDate.getDate())))
            }
            else {
                datesArray.push(new Date(startDate.setDate(startDate.getDate() + 1)))
            }
        }
        this.setState({ dates: datesArray, });
    }

    showSearchDrawer = () => {
        this.setState({ showSearchDrawer: true })
    }

    hideSearchDrawerHandler = () => {
        this.setState({ searchDataTextField: "", showSearchDrawer: false, searchDisplayingData: [] })
    }

    changeDateHandler = (dateString) => {
        this.setState({ date: new Date(dateString) })
        this.componentWillMount(new Date(dateString))
        console.log("-----------selected----Date--------", new Date(dateString))
    }

    SwipedRight = () => {
        let firstDate = this.state.dates[0];
        let datesArray = [];

        firstDate.setDate(firstDate.getDate() - 7)

        this.componentWillMount(firstDate)
        firstDate.setDate(firstDate.getDate() - 1)

        for (let i = 0; i < 7; i++) {
            datesArray.push(new Date(firstDate.setDate(firstDate.getDate() + 1)))
        }
        this.setState({ dates: datesArray, })
    }


    SwipedLeft = () => {

        let lastDate = this.state.dates[6];

        lastDate.setDate(lastDate.getDate() + 1)
        this.componentWillMount(lastDate)
        lastDate.setDate(lastDate.getDate() - 1)

        let datesArray = [];

        for (let i = 0; i < 7; i++) {
            datesArray.push(new Date(lastDate.setDate(lastDate.getDate() + 1)))
        }
        this.setState({ dates: datesArray })
    }

    selectDateHandler = (item, index) => {
        console.log("---------------", index)
        this.setState({ selectedDateIndex: index })
        this.componentWillMount(item)
    }
    toEditDate = (item) => {
        this.props.history.push({
            pathname: "/Add_details",
            //   state: { edit: item}
        })
        //   this.props.history.push({pathname: "/Signin" })
        localStorage.setItem("edit", "edit");
        localStorage.setItem('testObject', JSON.stringify(item));

    }

    searchDataHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })

        let self = this;
        console.log("---------url-------", event.target.value)

        let url = "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/PersonalAccs?$filter=contains(payee,'" + event.target.value + "') or contains(category_name,'" + event.target.value + "') or contains(amount,'" + event.target.value + "')"

        console.log("---------url-------", url)

        axios({
            method: 'get',
            url: url,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': "Basic " + this.state.user_password,
                'Content-Type': 'application/json'
            },
        })
            .then(function (response) {

                self.setState({ searchDisplayingData: response.data.value })
                console.log("------response-------", response.data.value)
            })
    }

    render() {

        var style = { backgroundColor: "#71A3F5", borderRadius: 50, width: 30, margin: "auto", height: 30, paddingTop: 5 }

        var calander =
            <Row style={{ height: 60 }} >
                <Col span={1}>  </Col>
                {this.state.dates.map((item, index) =>
                    (this.state.selectedDateIndex === index) ?
                        <Col span={3} style={{ marginRight: 3 }} onClick={() => this.selectDateHandler(item, index)}>
                            <Row style={style}>
                                {item.getDate()}
                            </Row>
                            <Row style={{ fontSize: "80%", color: "#3ED255" }}>
                                {this.state.totalIncomeOfday === 0 ? null : this.state.totalIncomeOfday}
                            </Row>

                            <Row style={{ fontSize: "80%", color: "#ff6060" }}>
                                {this.state.totalExpenseOfday === 0 ? null : this.state.totalExpenseOfday}
                            </Row>

                        </Col>
                        :
                        <Col span={3} style={{ marginRight: 3 }} onClick={() => this.selectDateHandler(item, index)}>
                            <div style={{ paddingTop: 5 }}>
                                {item.getDate()}
                            </div>
                        </Col>
                )
                }
                <Col span={1}>  </Col>
            </Row>

        var data = this.state.displayingData.map((item) =>
            <Row style={{ marginTop: 10, textAlign: "left" }} onClick={() => this.toEditDate(item)}>
                <Col span={1}></Col>
                <Col span={3} onClick={this.showCotegoriesHandler}>
                    <img src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="90%" />
                </Col>
                <Col span={8} style={{ paddingLeft: 10 }}>
                    {item.payee}
                    <br />
                    <div style={{ color: "#c8c8c8" }}>  {item.category_name}</div>
                </Col>
                <Col span={1}></Col>
                <Col span={10} style={{ textAlign: "right" }}>
                    {item.type === "Expense" ?
                        <div style={{ color: '#F49175' }}>&#8377; {item.amount}.00</div>
                        :
                        <div style={{ color: '#2FCE49' }}>&#8377; {item.amount}.00</div>
                    }
                </Col>
                <Col span={1}></Col>
            </Row>
        )

        var searchData = this.state.searchDisplayingData.map((item) =>
            <Row style={{ marginTop: 10, textAlign: "left" }} onClick={() => this.toEditDate(item)}>
                <Col span={1}></Col>
                <Col span={3} onClick={this.showCotegoriesHandler}>
                    <img src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="90%" />
                </Col>
                <Col span={8} style={{ paddingLeft: 10 }}>
                    {item.payee}
                    <br />
                    <div style={{ color: "#c8c8c8" }}>  {item.category_name}</div>
                </Col>
                <Col span={1}></Col>
                <Col span={10} style={{ textAlign: "right" }}>
                    {item.type === "Expense" ?
                        <div style={{ color: '#F49175' }}>&#8377; {item.amount}.00</div>
                        :
                        <div style={{ color: '#2FCE49' }}>&#8377; {item.amount}.00</div>
                    }
                </Col>
                <Col span={1}></Col>
            </Row>
        )

        return (
            <div>
                <div className="header_of_home_page">
                    <Row style={{ fontSize: 25 }}>
                        <Col span={5} onClick={this.props.menuOpenerHandler}  ><img src={menu} alt="menu icon" width="26px" /></Col>
                        <Col span={11} style={{ fontSize: "80%", paddingTop: 5 }} ><span style={{ color: "#5a7af0" }}>{months[this.state.date.getMonth()]}</span> {this.state.date.getUTCFullYear()}</Col>
                        <Col span={3} style={{ paddingTop: 3 }} onClick={this.showSearchDrawer}><Icon type="search" style={{ color: "#c8c8c8" }} /></Col>
                        <Col span={5}>
                            <lable>
                                <img src={calendar} alt="calendar" width="26px" />
                                <DatePicker
                                    style={{ width: 10 }}
                                    onChange={this.changeDateHandler}
                                    value={moment(this.state.date)}
                                />
                            </lable>
                        </Col>
                    </Row>
                    <hr />

                    <Swipeable onSwipedRight={this.SwipedRight} onSwipedLeft={this.SwipedLeft}>
                        <Row style={{ paddingTop: 5, color: "#c8c8c8" }}>
                            <Col span={1}>  </Col>
                            <Col span={3} style={daysStyle}> Sun</Col>
                            <Col span={3} style={daysStyle}> Mon</Col>
                            <Col span={3} style={daysStyle}> Tue</Col>
                            <Col span={3} style={daysStyle}> Wed</Col>
                            <Col span={3} style={daysStyle}> Thu</Col>
                            <Col span={3} style={daysStyle}> Fri</Col>
                            <Col span={3} style={daysStyle}> Sat</Col>
                        </Row>
                        {calander}
                    </Swipeable>

                    <hr />
                </div>

                {this.state.displayingData.length === 0 ? <div style={{ paddingTop: "40%" }}><Empty /></div> : data}


                <Drawer
                    placement="bottom"
                    height={this.state.heightOfDrawer}
                    closable={false}
                    onClose={this.hideSearchDrawerHandler}
                    visible={this.state.showSearchDrawer}
                >
                    <div style={{position:"sticky",top:0,}}>

                    <Row style={{ paddingBottom: 15, paddingTop: 15,backgroundColor:"#ffffff"}}>
                        <Col span={1}></Col>
                        <Col span={18}>
                            <Input
                                autoComplete="off"
                                width="100px"
                                placeholder="Search"
                                name="searchDataTextField"
                                value={this.state.searchDataTextField}
                                onChange={this.searchDataHandler}
                                suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </Col>
                        <Col span={4} onClick={this.hideSearchDrawerHandler} style={{ textAlign: "right", paddingTop: 8 }}>Cancel</Col>
                        <Col span={1}></Col>
                    </Row>
                    <hr />
                    {searchData}
                    </div>
                </Drawer>
            </div>
        );
    }
}
export default (Calander);