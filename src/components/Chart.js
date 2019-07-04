import React, { Component } from 'react';
import { Popover, Button, Row, Col, Icon, Select } from 'antd';
import menu from '../images/menu.png';
import axios from 'axios';
import PieChart from 'react-minimal-pie-chart';
import { Swipeable } from 'react-swipeable';
import { Empty } from 'antd';

const url = "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/"
var url_loadmoar = ""
const Option = Select.Option;
const ButtonGroup = Button.Group;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
var years = [];

var incomeDataArray = []
var expenseDataArray = []

var totalIncome = 0;
var totalExpense = 0;

const objJson = {
    "0": "#3652A3",
    "1": "#BB509E",
    "2": "#9A3466",
    "3": "#D5EEF5",
    "4": "#662068",
    "5": "#F47D81",
    "6": "#D2E6C8",
    "7": "#6DCDDD",
    "8": "#F2EB16",
    "9": "#36C7F4",
    "10": "#68F28C",
    "11": "#9696CA",
    "12": "#CC675E",
    "13": "#9E7545",
    "14": "#DBB8F8",
    "15": "#F26725",
    "16": "#323616",
    "17": "#9578B3",
    "18": "#8DB378",
}

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountsArray: [],
            selectDatePopOver:false,
            user_password: localStorage.getItem('user_password_v2'),
            selectedAccount: "Personal",
            segmentedControlStatus: "weekly",
            selectedYear: new Date().getFullYear(),
            selectedMonth: new Date(),
            selectedWeekFirstDay: new Date().setDate(new Date().getDate() - new Date().getDay()),
            chartDataIncome: [],
            chartDataExpense: [],
            incomeOrExpense: "Expense",
            monthlyButtonStyles: {
                backgroundColor: "#e6e6e6",
                color: "#fff",
                boxShadow: "none",
                borderRadius: 20,
                border: "none"
            },
            yearly: {
                backgroundColor: "#e6e6e6",
                color: "#fff",
                float: "right",
                boxShadow: "none"
            },
            weeklyButtonStyles: {
                backgroundColor: "#71a2f6",
                color: "#fff",
                float: "left",
                boxShadow: "none"
            },
            buttongroup: {
                width: 220,
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
            },

            incomeButtonStylessmall: {
                backgroundColor: "#e6e6e6",
                color: "#fff",
                boxShadow: "none"
            },
            expenseButtonStylessmall: {
                backgroundColor: "#71a2f6",
                color: "#fff",
                boxShadow: "none"
            },
            buttongroupsmall: {
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
                width: 160,
            },
        }
    }

    componentWillMount() {

        window.sessionStorage.setItem('component', "Chart");

        if (years.length === 0) {
            let year = new Date()
            year = year.getFullYear()
            for (let i = 5; i > -1; i--) {
                years.push(year - i)
            }
        }

        if (this.state.accountsArray.length === 0) {
            let self = this;
            axios({
                method: 'get',
                url: url + "AccountTypes",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Basic " + this.state.user_password,
                    'Content-Type': 'application/json'
                },
            })
                .then(function (response) {
                    self.setState({ accountsArray: response.data.value, })
                })
        }
    }

    componentDidMount(arg, duration) {

        var dataDateAsArgument = arg;
        var duration = duration;
        var sd = ""
        var ed = ""

        if (duration === "yearly") {
            sd = String(dataDateAsArgument) + "-01-01"
            ed = String(dataDateAsArgument) + "-12-31"
        }

        else if (duration === "monthly") {

            // console.log("--------month start date----------",dataDateAsArgument)

            var startDateOfMonth = new Date(dataDateAsArgument.getFullYear(), dataDateAsArgument.getMonth(), 1);
            var lastDate = new Date(startDateOfMonth.getFullYear(), startDateOfMonth.getMonth() - 1, 0);
            var month = startDateOfMonth.getMonth()
            month = String(month + 1)

            if (startDateOfMonth.getMonth() + 1 < 10) {
                month = "0" + String(month)
            }

            sd = String(startDateOfMonth.getFullYear()) + "-" + month + "-01"
            ed = String(startDateOfMonth.getFullYear()) + "-" + month + "-" + String(lastDate.getDate())

            // console.log("--------month start date----------",sd,ed)

        }

        else if (duration === "weekly" || duration === undefined) {
            var firsrDayofWeek = new Date();
            if (duration === "weekly") {
                firsrDayofWeek = new Date(dataDateAsArgument);
            }

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

            sd = String(firsrDayofWeek.getFullYear()) + "-" + startMonth + "-" + startDdate
            ed = String(firsrDayofWeek.getFullYear()) + "-" + endMonth + "-" + endDate
        }
        if (duration === "fromSelectingAccount") { url_loadmoar = dataDateAsArgument }
        else {
            url_loadmoar = url + "PersonalAccs?$filter=date le '" + ed + "' and date ge '" + sd + "' and account_type_id eq '" + this.state.selectedAccount + "'"
        }

        let self = this;
        // console.log("-----------------url-------", url_loadmoar)
        axios({
            method: 'get',
            url: url_loadmoar,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': "Basic " + this.state.user_password,
                'Content-Type': 'application/json'
            },
        })
            .then(function (response) {

                incomeDataArray = []
                expenseDataArray = []
                totalIncome = 0;
                totalExpense = 0;

                const incomeresult = response.data.value.filter(word => word.type == "Income");
                const expenseresult = response.data.value.filter(word => word.type == "Expense");

                var flags = [], outpuIncomeCategories = [], l = expenseresult.length, i;

                for (i = 0; i < l; i++) {
                    if (flags[expenseresult[i].category_name]) continue;
                    flags[expenseresult[i].category_name] = true;

                    let object = {}
                    object.category_name = expenseresult[i].category_name;
                    object.category_id = expenseresult[i].category_id;

                    outpuIncomeCategories.push(object);
                }

                for (let k = 0; k < outpuIncomeCategories.length; k++) {
                    var expense = 0;
                    let obj = {}
                    obj.title = outpuIncomeCategories[k].category_name

                    for (let l = 0; l < expenseresult.length; l++) {
                        if (outpuIncomeCategories[k].category_name == expenseresult[l].category_name) {
                            expense += Number(expenseresult[l].amount)
                        }
                    }
                    obj.value = expense

                    obj.type = "Expense"

                    totalExpense += expense

                    obj.color = objJson[k]
                    if (k > 18) { obj.color = self.getRandomColor() }

                    expenseDataArray.push(obj)
                }

                self.setState({ chartDataExpense: expenseDataArray });

                var flags = [], outpuIncomeCategories = [], l = incomeresult.length, i;

                for (i = 0; i < l; i++) {
                    if (flags[incomeresult[i].category_name]) continue;
                    flags[incomeresult[i].category_name] = true; let
                        object = {}

                    object.category_name = incomeresult[i].category_name;
                    object.category_id = incomeresult[i].category_id;

                    outpuIncomeCategories.push(object);
                }

                for (let k = 0; k < outpuIncomeCategories.length; k++) {
                    var income = 0;
                    let obj = {}
                    obj.title = outpuIncomeCategories[k].category_name

                    for (let l = 0; l < incomeresult.length; l++) {
                        if (outpuIncomeCategories[k].category_name == incomeresult[l].category_name) {
                            income += Number(incomeresult[l].amount)
                        }
                    }

                    obj.value = income

                    obj.type = "Income"

                    totalIncome += income

                    obj.color = objJson[k]
                    if (k > 18) { obj.color = self.getRandomColor() }
                    incomeDataArray.push(obj)
                }

                self.setState({ chartDataIncome: incomeDataArray });

            })
    }

    selectDatePopOverHandler=()=>{
      this.setState({selectDatePopOver:!this.state.selectDatePopOver})
    }

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    incomeButtonHandlersmall = () => {
        this.setState({
            incomeOrExpense: "Income",
            expenseButtonStylessmall: {
                backgroundColor: "#e6e6e6",
                color: "fff",
                boxShadow: "none"
            },
            incomeButtonStylessmall: {
                backgroundColor: "#71a2f6",
                color: "fff",
                boxShadow: "none"
            },
            buttongroupsmall: {
                width: 160,
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
            },
        })
    }

    expenseButtonHandlersmall = () => {

        this.setState({
            incomeOrExpense: "Expense",
            incomeButtonStylessmall: {
                backgroundColor: "#e6e6e6",
                color: "#fff",
                boxShadow: "none"
            },

            expenseButtonStylessmall: {
                backgroundColor: "#71a2f6",
                color: "#fff",

                boxShadow: "none"
            },

            buttongroupsmall: {
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
                width: 160,
            },
        })

    }

    handelSelectAccount = (value) => {
        this.setState({ selectedAccount: value })

        let res = url_loadmoar.split("eq")
        url_loadmoar = res[0] + "eq " + "'" + (value) + "'"

        this.componentDidMount(url_loadmoar, "fromSelectingAccount");

    }

    weeklyButtonHandler = () => {
      this.selectDatePopOverHandler()
        this.setState({
            segmentedControlStatus: "weekly",
            monthlyButtonStyles: {
                backgroundColor: "#e6e6e6",
                color: "#fff",
                boxShadow: "none",
                borderRadius: 20,
                border: "none"
            },

            yearly: {
                backgroundColor: "#e6e6e6",
                color: "#fff",
                boxShadow: "none"
            },

            weeklyButtonStyles: {
                backgroundColor: "#71a2f6",
                color: "#fff",
                boxShadow: "none"
            },

            buttongroup: {
                width: 220,
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
            },
        })
        this.componentDidMount(new Date(), "weekly")
    }

    monthlyButtonHandler = () => {
        this.setState({
            segmentedControlStatus: "monthly",
            selectedMonth: new Date(),
            weeklyButtonStyles: {
                backgroundColor: "#e6e6e6",
                color: "fff",
                boxShadow: "none"
            },
            monthlyButtonStyles: {
                backgroundColor: "#71a2f6",
                color: "fff",
                boxShadow: "none",
                borderRadius: 20,
                border: "none"
            },
            yearly: {
                backgroundColor: "#e6e6e6",
                color: "#fff",
                boxShadow: "none"
            },

            buttongroup: {
                width: 220,
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
            },
        })
        this.componentDidMount(new Date(), "monthly")
    }


    yearlyButtonHandler = () => {
        this.setState({
            segmentedControlStatus: "yearly",
            selectedYear: new Date().getFullYear(),
            weeklyButtonStyles: {
                backgroundColor: "#e6e6e6",
                color: "fff",
                boxShadow: "none"
            },
            monthlyButtonStyles: {
                backgroundColor: "#e6e6e6",
                color: "fff",
                boxShadow: "none",
                borderRadius: 20,
                border: "none"
            },
            yearly: {
                backgroundColor: "#71a2f6",
                color: "fff",
                boxShadow: "none"
            },
            buttongroup: {
                width: 220,
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
            },
        })
        this.componentDidMount(new Date().getFullYear(), "yearly")
    }

    selectectingAMonth = (selectedMonth) => {

        var modefyMonth = new Date(this.state.selectedMonth)
        modefyMonth.setMonth(selectedMonth)

        console.log("======modefyMonth", modefyMonth)

        this.setState({ selectedMonth: modefyMonth })
        this.componentDidMount(modefyMonth, "monthly")

        this.selectDatePopOverHandler()
    }

    selectingAnYearHandler = (selectedYear) => {
        this.setState({ selectedYear: selectedYear })
        this.componentDidMount(selectedYear, "yearly")
        this.selectDatePopOverHandler()
    }

    SwipedRight = (dateAsArgument) => {

        console.log("-----right--", dateAsArgument)

        if (this.state.segmentedControlStatus === "weekly") {
            this.setState({ selectedWeekFirstDay: dateAsArgument })
            this.componentDidMount(dateAsArgument, "weekly")
        }

        if (this.state.segmentedControlStatus === "yearly") {
            this.setState({ selectedYear: dateAsArgument })
            this.componentDidMount(dateAsArgument, "yearly")
        }

        if (this.state.segmentedControlStatus === "monthly") {
            this.setState({ selectedMonth: dateAsArgument })
            this.componentDidMount(dateAsArgument, "monthly")
        }


    }

    SwipedLeft = (dateAsArgument) => {

        console.log("-----left--", dateAsArgument)

        if (this.state.segmentedControlStatus === "weekly") {
            this.setState({ selectedWeekFirstDay: dateAsArgument })
            this.componentDidMount(dateAsArgument, "weekly")
        }

        if (this.state.segmentedControlStatus === "yearly") {
            this.setState({ selectedYear: dateAsArgument })
            this.componentDidMount(dateAsArgument, "yearly")
        }
        if (this.state.segmentedControlStatus === "monthly") {
            this.setState({ selectedMonth: dateAsArgument })
            this.componentDidMount(dateAsArgument, "monthly")
        }

    }

    render() {

        // console.log("---------render-----------")

        if (this.state.segmentedControlStatus === "yearly") {
            let year = this.state.selectedYear
            var dates = <div>
                <Swipeable onSwipedRight={() => this.SwipedRight(year - 1)} onSwipedLeft={() => this.SwipedLeft(year + 1)}>
                    <Row style={{ paddingTop: 15, paddingBottom: 10, }}>
                        <Col span={8} onClick={() => this.SwipedRight(year - 1)}>{year - 1}</Col>
                        <Col span={8} style={{ color: "#5A7AF0" }} trigger="click" >{year}</Col>
                        <Col span={8} onClick={() => this.SwipedLeft(year + 1)} >{year + 1}</Col>
                    </Row>
                </Swipeable>
            </div>
        }

        if (this.state.segmentedControlStatus === "monthly") {

            var previousMonth = new Date(this.state.selectedMonth.getFullYear(), this.state.selectedMonth.getMonth(), 1);
            previousMonth = previousMonth.setDate(previousMonth.getDate() - 1)
            previousMonth = new Date(previousMonth);
            previousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);

            var nextMonth = new Date(this.state.selectedMonth.getFullYear(), this.state.selectedMonth.getMonth() + 1, 0)
            nextMonth = nextMonth.setDate(nextMonth.getDate() + 1)
            nextMonth = new Date(nextMonth);
            nextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);

            var dates = <div>
                <Swipeable onSwipedRight={() => this.SwipedRight(previousMonth)} onSwipedLeft={() => this.SwipedLeft(nextMonth)}>
                    <Row style={{ paddingTop: 15, paddingBottom: 10, }}>
                        <Col span={8} onClick={() => this.SwipedRight(previousMonth)}>{months[previousMonth.getMonth()] + "-" + previousMonth.getFullYear()}</Col>
                        <Col span={8} style={{ color: "#5A7AF0" }}>{months[this.state.selectedMonth.getMonth()] + "-" + this.state.selectedMonth.getFullYear()}</Col>
                        <Col span={8} onClick={() => this.SwipedLeft(nextMonth)}>{months[nextMonth.getMonth()] + "-" + nextMonth.getFullYear()}</Col>
                    </Row>
                </Swipeable>
            </div>
        }

        if (this.state.segmentedControlStatus === "weekly") {
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

            var dates = <div>
                <Swipeable onSwipedRight={() => this.SwipedRight(selectedWeekPrevious)} onSwipedLeft={() => this.SwipedLeft(selectedWeekNext)}>
                    <Row style={{ paddingTop: 15, paddingBottom: 10, }}>
                        <Col span={8} onClick={() => this.SwipedRight(selectedWeekPrevious)}>{selectedWeekPrevious.getDate() + " " + months[selectedWeekPrevious.getMonth()]} - {selectedWeekPreviousLast.getDate() + " " + months[selectedWeekPreviousLast.getMonth()]}</Col>
                        <Col span={8} style={{ color: "#5A7AF0" }}>{selectedWeek.getDate() + " " + months[selectedWeek.getMonth()]} - {selectedWeekLast.getDate() + " " + months[selectedWeekLast.getMonth()]}</Col>
                        <Col span={8} onClick={() => this.SwipedLeft(selectedWeekNext)}>{selectedWeekNext.getDate() + "-" + months[selectedWeekNext.getMonth()]} - {selectedWeekNextlast.getDate() + "-" + months[selectedWeekNextlast.getMonth()]}</Col>
                    </Row>
                </Swipeable>
            </div>
        }

        if (this.state.segmentedControlStatus === "monthly") {
            var data = (
                <div>
                    <Row>
                        {months.map((item, index) =>
                            this.state.selectedMonth.getMonth() === index ?
                                <div style={{ display: "inline", paddingTop: 5 }} >
                                    <Col span={4} ><span style={{ fontSize: "120%", padding: 10, color: "#71a2f6" }}>{item}</span></Col>
                                </div>
                                :
                                <div style={{ display: "inline", paddingTop: 5 }} onClick={() => this.selectectingAMonth(index)}>
                                    <Col span={4} ><span style={{ fontSize: "120%", padding: 10 }}>{item}</span></Col>
                                </div>
                        )}
                    </Row>
                </div>
            )
        }

        else if (this.state.segmentedControlStatus === "yearly") {
            var data = (
                <div style={{ padding: 10 }}>
                    <Row style={{ display: "inline" }}>
                        {years.map(item =>
                            (this.state.selectedYear === item) ?
                                <div onClick={() => this.selectingAnYearHandler(item)}> <Col span={4} ><span style={{ fontSize: "120%", color: "#71a2f6" }}>{item}</span></Col></div>
                                :
                                <div onClick={() => this.selectingAnYearHandler(item)}> <Col span={4} ><span style={{ fontSize: "120%", }}>{item}</span></Col></div>
                        )}
                    </Row>
                </div>
            )
        }

        var text = (
            <div style={{ width: "100%", margin: "auto" }} >
                <Row style={{ paddingTop: 5, paddingBottom: 5 }} >
                    <Col span={5} style={{ marginTop: 8, marginLeft: 10, color: "#e6e6e6" }} >
                        {
                            this.state.segmentedControlStatus === "monthly" ?
                                this.state.selectedMonth.getFullYear() :
                                null
                        }
                    </Col>
                    <Col span={16} >
                        <div style={this.state.buttongroup}>
                            <ButtonGroup style={{ margin: "auto" }}>
                                <Button style={this.state.weeklyButtonStyles} onClick={this.weeklyButtonHandler}>weekly</Button>
                                <Button style={this.state.monthlyButtonStyles} onClick={this.monthlyButtonHandler}>monthly</Button>
                                <Button style={this.state.yearly} onClick={this.yearlyButtonHandler}>yearly</Button>
                            </ButtonGroup>
                        </div></Col>
                    <Col span={3} ></Col>
                </Row>
                {data}
            </div>
        )

        if (this.state.incomeOrExpense === "Expense") { var chartData = this.state.chartDataExpense }
        else { var chartData = this.state.chartDataIncome }

        return (
            <div>
                <div className="header_of_home_page" >
                    <Row style={{ fontSize: 25, paddingBottom: 10 }}>
                        <Col span={5} onClick={this.props.menuOpenerHandler} ><img src={menu} alt="menu icon" width="26px" /></Col>
                        <Col span={2}></Col>
                        <Col span={11} >
                            <Select
                                defaultValue="Personal"
                                style={{ width: "100%", border: "none", outline: "none" }}
                                onChange={this.handelSelectAccount}>
                                {
                                    this.state.accountsArray.map(Item =>
                                        <Option value={Item.account_type_name}>{Item.account_type_name}</Option>
                                    )
                                }
                            </Select>
                        </Col>
                        <Col span={2}></Col>
                        <Popover 
                        placement="bottomRight" 
                        content={text} 
                        trigger="click" 
                        visible={this.state.selectDatePopOver}
                        onClick={this.selectDatePopOverHandler}
                        >
                            <Col span={4}  ><Icon type="clock-circle" style={{ color: "#555555" }} /></Col>
                        </Popover>
                    </Row>
                    <hr />
                    {dates}
                    <hr />
                </div>
                <Row >
                    <Col span={7} ></Col>
                    <Col span={10} style={{ paddingTop: 15, paddingBottom: 10 }} >
                        <div style={this.state.buttongroupsmall}>
                            <ButtonGroup >
                                <Button style={this.state.expenseButtonStylessmall} onClick={this.expenseButtonHandlersmall}>Expense</Button>
                                <Button style={this.state.incomeButtonStylessmall} onClick={this.incomeButtonHandlersmall}>Income</Button>
                            </ButtonGroup>
                        </div></Col>
                    <Col span={7}> </Col>
                </Row>

                {chartData.length === 0 ?<div style={{paddingTop:"30%"}}>  <Empty /> </div> :

                    <div >

                        <PieChart
                            animate={true}
                            radius="40"
                            data={chartData}
                        />
                        {chartData.map((item) =>
                            <Row style={{ mrgin: 0, width: "100%" }}>
                                <Col span={2} ></Col>
                                <Col span={4} style={{ backgroundColor: item.color, height: 18, paddingTop: 3, marginLeft: 5, marginRight: 5 }} ></Col>
                                <Col span={8} style={{ padding: 0, textAlign: "left" }}> {item.title}</Col>
                                <Col span={8} style={{ padding: 0, textAlign: "right" }}>INR {item.value}</Col>
                                <Col span={2} ></Col>
                            </Row>
                        )}
                    </div>
                }

            </div>
        );
    }
}
export default (Chart);