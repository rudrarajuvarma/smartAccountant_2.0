import React, { Component } from 'react';
import { Button, Drawer, Row, Col, Icon, Progress } from 'antd';
import menu from '../images/menu.png';
import settings from '../images/settings.png';
import axios from 'axios';
import Checkbox from 'react-simple-checkbox';
import { Swipeable } from 'react-swipeable';
import { Empty } from 'antd';


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const months1 = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
const months2 = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"]

var selectedArray = [];
var unSelectedArray = [];
var removedBills = []
const ButtonGroup = Button.Group;
const buttonStyle = {
    width: "100%",
    border: "none",
    backgroundColor: "#71a2f6",
    height: "50px",
    position: "fixed",
    bottom: 0,
    color: "#fff",
    outline: "none",
    selectCategories: false,
}

class Budget extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_password: localStorage.getItem('user_password_v2'),
            showDrawer: false,
            categories_obj: [],
            budgets_obj: [],
            repeat: "Week",
            selectedWeekFirstDay: new Date().setDate(new Date().getDate() - new Date().getDay()),
            dateForSelectedMonth: new Date(String((new Date().getMonth() + 1) + "/" + 1 + "/" + (new Date().getFullYear()))),
            incomeButtonStyles: {
                backgroundColor: "#e6e6e6",
                color: "#fff",
                float: "right",
                boxShadow: "none"
            },
            expenseButtonStyles: {
                backgroundColor: "#71a2f6",
                color: "#fff",
                float: "left",
                boxShadow: "none"
            },
            buttongroup: {
                width: 160,
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
                float: "right"
            },
        }
    }

    monthlyButtonHandler = () => {
        this.setState({
            repeat: "Month",
            incomeOrExpense: "Income",
            expenseButtonStyles: {
                backgroundColor: "#e6e6e6",
                color: "fff",
                float: "left",
                boxShadow: "none"
            },
            incomeButtonStyles: {
                backgroundColor: "#71a2f6",
                color: "fff",
                float: "right",
                boxShadow: "none"
            },
            buttongroup: {
                width: 160,
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
                float: "right"
            },
        })
    }

    weeklyButtonHandler = () => {
        this.setState({
            repeat: "Week",
            incomeOrExpense: "Expense",
            incomeButtonStyles: {
                backgroundColor: "#e6e6e6",
                color: "#fff",
                float: "right",
                boxShadow: "none"
            },

            expenseButtonStyles: {
                backgroundColor: "#71a2f6",
                color: "#fff",
                float: "left",
                boxShadow: "none"
            },

            buttongroup: {
                width: 160,
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
                float: "right"
            },
        })
    }

    componentWillMount(dataDateAsArgument) {

        window.sessionStorage.setItem('component', "Budget");

        if (this.state.repeat === "Month" && dataDateAsArgument !== undefined) {
            var startdateAsResponse = new Date(dataDateAsArgument)

            if (startdateAsResponse.getMonth() + 1 < 10) {
                var month = "0" + (startdateAsResponse.getMonth() + 1)
            }
            else { var month = startdateAsResponse.getMonth() + 1 }
            var startdate = String(startdateAsResponse.getFullYear() + "-" + month + "-" + "01")
            let startdateObj = new Date(startdate);

            let lastDate = new Date(startdateObj.getFullYear(), startdateObj.getMonth() + 1, 0);

            if (lastDate.getMonth() + 1 < 10) {
                var monthOfEndDate = "0" + (lastDate.getMonth() + 1)
            }
            else { var monthOfEndDate = lastDate.getMonth() + 1 }
            var lastDateString = String(lastDate.getFullYear() + "-" + monthOfEndDate + "-" + lastDate.getDate())
        }

        else if (this.state.repeat === "Week" && dataDateAsArgument !== undefined) {

            var firsrDayofWeek = new Date(dataDateAsArgument);

            firsrDayofWeek.setDate(firsrDayofWeek.getDate() - firsrDayofWeek.getDay())

            var lastDayofWeek = new Date(firsrDayofWeek);
            lastDayofWeek.setDate(lastDayofWeek.getDate() + 6);

            var startMonth = String(firsrDayofWeek.getMonth() + 1)
            if (startMonth < 10) {
                startMonth = "0" + String(startMonth)
            }
            var startDdate = String(firsrDayofWeek.getDate())
            if (startDdate < 10) {
                startDdate = "0" + String(startDdate)
            }

            var endMonth = String(lastDayofWeek.getMonth() + 1)
            if (endMonth < 10) {
                endMonth = "0" + String(endMonth)
            }
            var endDate = String(lastDayofWeek.getDate())
            if (endDate < 10) {
                endDate = "0" + String(endDate)
            }
            startdate = String(firsrDayofWeek.getFullYear()) + "-" + startMonth + "-" + startDdate
            lastDateString = String(firsrDayofWeek.getFullYear()) + "-" + endMonth + "-" + endDate
        }

        else if (dataDateAsArgument === undefined) {
            startdate = ""
            lastDateString = ""
        }


        let self = this;
        axios({
            method: 'get',
            url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Budgets",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': "Basic " + this.state.user_password,
                'Content-Type': 'application/json',
                'startdate': startdate,
                'enddate': lastDateString,
            },
        })
            .then(function (response) {
                let Data = response.data.value[0];
                console.log("----------------dto -----ata------",Data)
                if (Data.button[0] === "Week") {
                    self.weeklyButtonHandler()
                }
                else {
                    self.monthlyButtonHandler()
                }


                let array = []
                // console.log("--------for id--Data", Data)
                for (let i = 0; i < Data.amount.length; i++) {
                    let obj = {}
                    obj.category_id = Data.category_id[i]
                    obj.account_id = localStorage.getItem('user_id_v2')
                    obj.category_name = Data.category_name[i]
                    obj.category_icon = Data.category_icon[i]//---------need to chamge---------to namee of icon
                    obj.amount = Data.amount[i]
                    obj.total = Data.total[i]
                    obj.category_color = ""
                    obj.button = Data.button[i]
                    obj.createdby = localStorage.getItem('user_name_v2')
                    obj.updatedby = localStorage.getItem('user_name_v2')
                    obj.budget_id = Data.budget_id[i]
                    obj.checked = true
                    array.push(obj)
                }
                console.log("--------for id", array)
                self.setState({ budgets_obj: array })
                selectedArray = array;
                unSelectedArray = array;
            })
    }

    showDrawer = () => {
        this.setState({ showDrawer: true })
    }
    hideDrawerHandler = () => {
        this.setState({ showDrawer: false })
    }

    closeSelectCategories = () => {
        this.setState({ selectCategories: false })
    }

    showCotegoriesHandler = () => {
        let self = this;
        axios({
            method: 'get',
            url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Categories",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': "Basic " + this.state.user_password,
                'Content-Type': 'application/json'
            },
        })
            .then(function (response) {
                let categories = response.data.value
                for (let i = 0; i < selectedArray.length; i++) {
                    for (let j = 0; j < categories.length; j++) {
                        if (selectedArray[i].category_id === categories[j].category_id) {
                            categories.splice(j, 1)
                        }
                    }
                }

                let resultantArray = selectedArray.concat(categories)
                self.setState({ categories_obj: resultantArray })
            })
        this.setState({ selectCategories: true })
    }

    checkBoxhandler = (id, index) => {

        if (selectedArray.includes(id)) {
            selectedArray = selectedArray.filter(word => word !== id)

            let unSelectCategories = this.state.categories_obj
            unSelectCategories[index].checked = false
            this.setState({ categories_obj: unSelectCategories })
        }
        else {
            selectedArray.push(id)
            // unSelectedArray.push(id)

            let selectCategories = this.state.categories_obj
            selectCategories[index].checked = true
            this.setState({ categories_obj: selectCategories })
        }
        this.setState({ budgets_obj: selectedArray })

        if (!unSelectedArray.includes(id)) {
            unSelectedArray.push(id)
        }
    }

    inputAddamountHandler = (event, index) => {
        selectedArray[index].amount = event.target.value
        this.setState({ budgets_obj: selectedArray })
    }

    selectedBudgetHandling = () => {
        this.setState({ selectCategories: false })
    }

    saveButtonHandler = () => {


        for (let i = 0; i < unSelectedArray.length; i++) {
            if (!selectedArray.includes(unSelectedArray[i])) {
                removedBills.push(unSelectedArray[i])
            }
        }

        for (let i = 0; i < unSelectedArray.length; i++) {
            var emptyField = 0
            if (unSelectedArray[i].amount == "null" || unSelectedArray[i].amount == undefined) {
                emptyField = 1
            }
           
        }

        console.log("dfghj--", unSelectedArray)
        if (emptyField === 0) {
            let obj = {
                "account_id": [],
                "category_id": [],
                "category_icon": [],
                "category_color": [],
                "category_name": [],
                "amount": [],
                "button": [],
                "delete_budget": [],
                "createdby": [],
                "updatedby": [],
                "budget_id": []
            }


            for (let i = 0; i < unSelectedArray.length; i++) {
                obj.account_id.push(localStorage.getItem('user_id_v2'))
                obj.category_id.push(unSelectedArray[i].category_id)
                obj.category_icon.push(unSelectedArray[i].category_icon)
                obj.category_color.push("")
                obj.category_name.push(unSelectedArray[i].category_name)
                obj.amount.push(unSelectedArray[i].amount)
                obj.button.push(this.state.repeat)
                obj.createdby.push(localStorage.getItem('user_name_v2'))
                obj.updatedby.push(localStorage.getItem('user_name_v2'))

                if (removedBills.includes(unSelectedArray[i])) { obj.delete_budget.push("True") }
                else { obj.delete_budget.push("False") }

                if (unSelectedArray[i].budget_id === undefined) { obj.budget_id.push("0") }
                else { obj.budget_id.push(unSelectedArray[i].budget_id) }
            }

            console.log("------data------obj",obj)

            let self = this;
            axios({
                method: 'post',
                url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Budgets",
                data: obj,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Basic " + this.state.user_password,
                    'Content-Type': 'application/json',
                },
            })
                .then(function (response) {
                    console.log("--------put response------------",response)
                    self.setState({
                        selectedWeekFirstDay: new Date().setDate(new Date().getDate() - new Date().getDay()),
                        dateForSelectedMonth: new Date(String((new Date().getMonth() + 1) + "/" + 1 + "/" + (new Date().getFullYear()))),
                    })
                    self.componentWillMount();
                })
            this.setState({ showDrawer: false })

        }
        else {

            alert("Please enter all mandetory fields")
        }
        // ----------------------------------------get----------------------------------------------
    }

    SwipedRight = (dateAsArgument) => {
        if (this.state.repeat === "Month") {
            let date = new Date(this.state.dateForSelectedMonth)
            date.setMonth(date.getMonth() - 1);
            this.setState({ dateForSelectedMonth: date });
            this.componentWillMount(date);
        }
        if (this.state.repeat === "Week") {
            this.setState({ selectedWeekFirstDay: dateAsArgument })
            this.componentWillMount(dateAsArgument)
        }
    }

    SwipedLeft = (dateAsArgument) => {
        let date = new Date(this.state.dateForSelectedMonth)
        date.setMonth(date.getMonth() + 1);
        this.setState({ dateForSelectedMonth: date })
        this.componentWillMount(date);

        if (this.state.repeat === "Week") {
            this.setState({ selectedWeekFirstDay: dateAsArgument })
            this.componentWillMount(dateAsArgument)
        }
    }

    render() {
        var img = this.state.categories_obj.map((item, index, array) => {
            return <div> <Row style={{ zIndex: 0 }}>
                <Col span={1}></Col>
                <Col span={4}>
                    <img key={item.category_icon} src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="50px" style={{ margin: "10px" }} />
                </Col>
                <Col span={2}></Col>
                <Col span={11} style={{ paddingTop: 25, textAlign: "left", fontSize: "120%" }}><span>{item.category_name}</span></Col>
                <Col span={5} style={{ paddingTop: 20, textAlign: "right" }}>
                    <Checkbox onChange={() => this.checkBoxhandler(item, index)} color="#c8c8c8" size={3} checked={item.checked} />
                </Col>
                <Col span={2}></Col>
            </Row><hr />
            </div>
        });

        if (this.state.repeat === "Month") {
            var swipeDates = (
                <Swipeable onSwipedRight={this.SwipedRight} onSwipedLeft={this.SwipedLeft}>
                    <Row style={{ paddingTop: 15, paddingBottom: 10 }}>
                        <Col span={8} onClick={this.SwipedRight}>{months1[this.state.dateForSelectedMonth.getMonth()] + "-" + this.state.dateForSelectedMonth.getFullYear()}</Col>
                        <Col span={8} style={{ color: "#5A7AF0" }}>{months[this.state.dateForSelectedMonth.getMonth()] + "-" + this.state.dateForSelectedMonth.getFullYear()}</Col>
                        <Col span={8} onClick={this.SwipedLeft}>{months2[this.state.dateForSelectedMonth.getMonth()] + "-" + this.state.dateForSelectedMonth.getFullYear()}</Col>
                    </Row>
                </Swipeable>
            )
        }
        else {

            let selectedWeek = new Date(this.state.selectedWeekFirstDay)

            let selectedWeekPrevious = new Date(this.state.selectedWeekFirstDay)
            selectedWeekPrevious.setDate(selectedWeekPrevious.getDate() - 7)

            let selectedWeekPreviousLast = new Date(this.state.selectedWeekFirstDay)
            selectedWeekPreviousLast.setDate(selectedWeekPreviousLast.getDate() - 1)

            let selectedWeekLast = new Date(this.state.selectedWeekFirstDay)
            selectedWeekLast.setDate(selectedWeekLast.getDate() + 6)

            let selectedWeekNext = new Date(this.state.selectedWeekFirstDay)
            selectedWeekNext.setDate(selectedWeekNext.getDate() + 7)

            let selectedWeekNextlast = new Date(this.state.selectedWeekFirstDay)
            selectedWeekNextlast.setDate(selectedWeekNextlast.getDate() + 13)

            var swipeDates = <div>
                <Swipeable onSwipedRight={() => this.SwipedRight(selectedWeekPrevious)} onSwipedLeft={() => this.SwipedLeft(selectedWeekNext)}>
                    <Row style={{ paddingTop: 15, paddingBottom: 10, }}>
                        <Col span={8} onClick={() => this.SwipedRight(selectedWeekPrevious)}>{selectedWeekPrevious.getDate() + " " + months[selectedWeekPrevious.getMonth()]} - {selectedWeekPreviousLast.getDate() + " " + months[selectedWeekPreviousLast.getMonth()]}</Col>
                        <Col span={8} style={{ color: "#5A7AF0" }}>{selectedWeek.getDate() + " " + months[selectedWeek.getMonth()]} - {selectedWeekLast.getDate() + " " + months[selectedWeekLast.getMonth()]}</Col>
                        <Col span={8} onClick={() => this.SwipedLeft(selectedWeekNext)}>{selectedWeekNext.getDate() + "-" + months[selectedWeekNext.getMonth()]} - {selectedWeekNextlast.getDate() + "-" + months[selectedWeekNextlast.getMonth()]}</Col>
                    </Row>
                </Swipeable>
            </div>

        }
        console.log("-budgets_obj-", this.state.budgets_obj)

        return (
            <div>
                <div>
                    <div className="header_of_home_page">
                        <Row style={{ fontSize: "25px", paddingBottom: 15 }}>
                            <Col span={5} onClick={this.props.menuOpenerHandler} ><img src={menu} alt="menu icon" width="26px" /></Col>
                            <Col span={15} style={{ fontSize: "80%", paddingTop: 5 }}><span >Budget</span></Col>
                            <Col span={4} onClick={this.showDrawer}><img src={settings} alt="menu icon" width="24px" /></Col>
                        </Row>
                        <hr />
                        <div>
                            {swipeDates}
                        </div>
                        <hr />
                    </div>

                    {this.state.budgets_obj.length === 0 ? <div style={{ paddingTop: "40%" }}>
                    <Empty 
                    description="No budgets"
                    />
                    
                    </div> 
                    :
                        <div style={{ paddding: 10, paddingBottom: 30 }}>
                            {this.state.budgets_obj.map(item =>
                                <div style={{ paddingTop: 10 }}>
                                    <Row >
                                        <Col span={1}></Col>
                                        <Col span={11} style={{ textAlign: "left" }}>{item.category_name}</Col>
                                        <Col span={11} style={{ textAlign: "right", color: "#c9c9c9" }}>
                                            {item.amount === "null" ? <div> &#8377; 0</div> : <div>&#8377; {item.amount}</div>}
                                        </Col>
                                        <Col span={1}></Col>
                                    </Row>
                                    <Row >
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                            <Progress percent={Math.ceil(item.total / item.amount * 100)} showInfo={false} />
                                        </Col>
                                        <Col span={1}></Col>
                                    </Row>
                                    <Row style={{ paddingBottom: 10 }}>
                                        <Col span={1}></Col>
                                        <Col span={11} style={{ textAlign: "left", color: "#B0BFD9" }}>
                                            {item.total == null ? <div>&#8377; 0</div> : <div>&#8377; {item.total}</div>}
                                        </Col>
                                        <Col span={11} style={{ textAlign: "right" }}>
                                            {item.amount - item.total < 0 ?

                                                <div style={{ color: "#ff6060" }}>{-(item.amount - item.total)}</div>
                                                :
                                                <div>&#8377; {item.amount - item.total} Left</div>

                                            }
                                        </Col>
                                        <Col span={1}></Col>
                                    </Row>
                                    <hr />
                                </div>
                            )
                            }
                        </div>
                    }
                </div>

                <Drawer
                    placement="right"
                    height={window.innerHeight}
                    width={"100%"}
                    closable={false}
                    onClose={this.hideCategeryScreen}
                    visible={this.state.showDrawer}
                >
                    {!(this.state.selectCategories) ?
                        <div>
                            <div style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "#fff" }}>
                                <Row style={{ fontSize: 20, textAlign: "center", height: 60, paddingTop: 15 }}>
                                    <Col span={1} ></Col>
                                    <Col span={3} style={{ textAlign: "left", }} onClick={this.hideDrawerHandler}><Icon type="left" /></Col>
                                    <Col span={15} ><span>Budget</span></Col>
                                    <Col span={4} onClick={this.saveButtonHandler}><span style={{ color: "#5a7af0" }}>Save</span></Col>
                                    <Col span={1} ></Col>
                                </Row>
                                <Row >
                                    <Col span={1}></Col>
                                    <Col span={12} style={{ paddingTop: 15, }} >Repeat</Col>
                                    <Col span={10} style={{ paddingTop: 15, paddingBottom: 10 }} >
                                        <div style={this.state.buttongroup}>
                                            <ButtonGroup style={{ textAlign: "right" }}>
                                                <Button style={this.state.expenseButtonStyles} onClick={this.weeklyButtonHandler}>Weekly</Button>
                                                <Button style={this.state.incomeButtonStyles} onClick={this.monthlyButtonHandler}>Monthly</Button>
                                            </ButtonGroup>
                                        </div>
                                    </Col>
                                    <Col span={1}></Col>
                                </Row>
                                <hr />
                            </div>
                            <div style={{ paddingBottom: 60 }}>
                                {this.state.budgets_obj.map((item, index) =>
                                    <Row>
                                        <Col span={1}></Col>
                                        <Col span={3}>
                                            <img key={item.category_icon} src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="40px" style={{ margin: "5px" }} />
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={8} style={{ paddingTop: 15, textAlign: "left", fontSize: "100%", }}><span>{item.category_name}</span></Col>
                                        <Col span={10} style={{ paddingTop: 15, }}>
                                            <input
                                                type="number"
                                                value={item.amount}
                                                autoComplete="off"
                                                onChange={(event) => this.inputAddamountHandler(event, index)}
                                                style={{ border: "none", outline: "none", textAlign: "right", width: "100%" }} />
                                        </Col>
                                        <Col span={1}></Col>
                                    </Row>
                                )
                                }
                            </div>
                            <button style={buttonStyle} onClick={this.showCotegoriesHandler}>Select Category</button>
                        </div>
                        :
                        <div>
                            <div style={{ textAlign: "left", paddingTop: 15, paddingBottom: 10, position: "sticky", top: 0, backgroundColor: "#ffffff", zIndex: 100 }}>
                                <Row>
                                    <Col span={2}></Col>
                                    <Col span={4} onClick={this.closeSelectCategories} ><Icon type="close" style={{ fontSize: 20 }} /></Col>
                                    <Col span={12}></Col>
                                    <Col span={4} style={{ fontSize: 20, textAlign: "right" }} onClick={this.selectedBudgetHandling}><Icon type="check" /></Col>
                                    <Col span={2}></Col>
                                </Row>
                                <Row style={{ textAlign: "left", paddingTop: 10, paddingBottom: 10, backgroundColor: "#F6F6F6" }}>
                                    <Col span={2}></Col>
                                    <Col span={22} style={{ fontSize: 12 }}>SELECT CATEGORIES FOR MONITER</Col>
                                </Row>
                            </div>
                            {img}
                        </div>
                    }
                </Drawer>
            </div>
        );
    }
}
export default (Budget);