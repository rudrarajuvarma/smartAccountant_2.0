
import React, { Component } from 'react';
import { Drawer, Row, Col, Icon } from 'antd';
import menu from '../images/menu.png';
import { DatePicker } from 'antd';
import calendar from '../images/calendar.png';
import moment from 'moment';
import bell from '../images/bell.png';
import axios from 'axios';
import Show_categories from './Show_categories';
import { Empty } from 'antd';


var bill_unique_names=[]
var overDueTotal = 0
var WithInSevenDaysTotal = 0
var WithInThirtyDaysTotal = 0
var GraterThanThirtyDaysTotal = 0

var editBillsData = {}
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const headerDIVstyles = {
    backgroundColor: "#FE7364",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 20,
    color: "#ffffff",
}

const headerTextFieldsStyles = {
    border: "none",
    outline: "none",
    backgroundColor: "#FE7364",
    color: "#ffffff"
}

const headerLargeTextFieldsStyles = {
    border: "none",
    outline: "none",
    backgroundColor: "#FE7364",
    color: "#ffffff",
    height: 50,
    fontSize: 50,
    width: 150,
    textAlign: "right"
}

class Bills extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_password: localStorage.getItem('user_password_v2'),
            showDrawer: false,
            showEditBillsDrawer: false,
            date: new Date(),
            image: "General",
            payee: "",
            amount: "",
            category: "Others",
            category_id: "",
            showIcon: false,
            img: this.props.filter_value,
            overDueDataArray: [],
            dueWithInSevenDays: [],
            dueWithInThirtyDays: [],
            dueGraterThanThirtyDays: [],
            categories_obj: [],
            editIconsScreen: true,
            user_id: localStorage.getItem('user_id_v2'),
        }
    }

    dateToYMD = (date) => {
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

     

    // componentWillMount() {
    //     localStorage.setItem('component', "Bills");
    //     let self = this;
    //     axios({
    //         method: 'get',
    //         url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Bills",
    //         headers: {
    //             'Access-Control-Allow-Origin': '*',
    //             'Authorization': "Basic " + this.state.user_password,
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //         .then(function (response) {

    //             var deleteBillsArray = []

    //             for (let i = 0; i < response.data.value.length; i++) {
    //                 if (response.data.value[i].bill_amount < response.data.value[i].paid_bill) {
    //                     response.data.value[i].delete_bill = "True"
    //                     deleteBillsArray.push(response.data.value[i])
    //                 }
    //             }


    //             for (let i = 0; i < deleteBillsArray.length; i++) {
    //                 var body = deleteBillsArray[i];
    //                 console.log("-------------1---body", body)
    //                 axios({
    //                     method: 'put',
    //                     url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Bills('" + deleteBillsArray[i].bill_id + "')",
    //                     body: body,
    //                     headers: {
    //                         'Access-Control-Allow-Origin': '*',
    //                         'Authorization': "Basic " + self.state.user_password,
    //                         'Content-Type': 'application/json',
    //                     },
    //                 })
    //                     .then(function (response) {
    //                         console.log("------------response--", response)
    //                     })
    //             }
    //         })
    // }



    componentWillMount() {

        window.sessionStorage.setItem('component', "Bills");
        let self = this;
        axios({
            method: 'get',
            url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Bills",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': "Basic " + this.state.user_password,
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                
               response.data.value.map(item=>{
                  let  result= item.bill_name.split("_")
                    bill_unique_names.push(result[0])}
                )
                console.log("------bill names----",bill_unique_names)
                var overDueDataArray = []
                var dueWithInSevenDays = []
                var dueWithInThirtyDays = []
                var dueGraterThanThirtyDays = []

                for (let i = 0; i < response.data.value.length; i++) {

                    let comparedDate = new Date(response.data.value[i].bill_date)
                    var diffDays = Math.ceil((new Date(comparedDate).getTime() - new Date().getTime()) / (86400000))

                    // console.log("-----due-date---", diffDays)

                    if (diffDays < 0) {
                        overDueDataArray.push(response.data.value[i])
                        overDueTotal += Number(response.data.value[i].bill_amount)
                    }
                    else if (diffDays <= 7 && diffDays > -1) {
                        dueWithInSevenDays.push(response.data.value[i])
                        WithInSevenDaysTotal += Number(response.data.value[i].bill_amount)
                    }
                    else if (diffDays <= 30 && diffDays > 6) {
                        dueWithInThirtyDays.push(response.data.value[i])
                        WithInThirtyDaysTotal += Number(response.data.value[i].bill_amount)
                    }
                    else {
                        dueGraterThanThirtyDays.push(response.data.value[i])
                        GraterThanThirtyDaysTotal += Number(response.data.value[i].bill_amount)
                    }
                }

                self.setState({
                    overDueDataArray: overDueDataArray,
                    dueWithInSevenDays: dueWithInSevenDays,
                    dueWithInThirtyDays: dueWithInThirtyDays,
                    dueGraterThanThirtyDays: dueGraterThanThirtyDays
                })
                // console.log("--------console------", response.data.value, "---dueArray--", dueArray)
            })
    }

    saveFunctionHandler = () => {
     
        if(bill_unique_names.includes(this.state.category)){
            alert("this bill is already exist")

        }
        else{

        if (this.state.payee !== "" && this.state.amount !== "") {
            let self = this;
            var profile_obj = {}
            var date = this.dateToYMD(new Date(this.state.date))

            profile_obj.account_id = this.state.user_id
            profile_obj.bill_name = this.state.payee
            profile_obj.bill_amount = this.state.amount
            profile_obj.paid_bill = ""
            profile_obj.bill_date = date
            profile_obj.category_id = this.state.category_id
            profile_obj.category_icon = this.state.image
            profile_obj.category_color = ""
            profile_obj.category_name = this.state.category
            profile_obj.createdby = localStorage.getItem('user_name_v2');
            profile_obj.updatedby = "create"
            profile_obj.delete_bill = "false"
            // console.log("------profile_obj---------", profile_obj)/
           
            axios({
                method: 'post',
                url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Bills",
                data: profile_obj,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Basic " + this.state.user_password,
                    'Content-Type': 'application/json'
                },
            })
                .then(function (response) {
                    console.log("-------response------", response)
                    self.setState({ showDrawer: false })
                    self.componentWillMount();
                })
        }
        else {
            alert("Please enter mandatory fields")
        }
    }
    }

    textFielseHandler = (event) => {
        if (event.target.name === "amount") {
            if (String(event.target.value).length <= 5) {
                this.setState({ [event.target.name]: event.target.value })
            }
        }
        else {
            this.setState({ [event.target.name]: event.target.value })
        }
    }

    highliteCategoryImage = (icon, name, id) => {
        this.setState({ image: icon, category: name, category_id: id })
        this.hideIconDrawer()
    }

    hideIconDrawer = () => {
        this.setState({ showIcon: false })
    }

    hideDrawerHandler = () => {
        this.setState({ showDrawer: false })
    }

    showDrawerHandler = () => {
        this.setState({ showDrawer: true })
    }

    showEditBillsDrawer = (data) => {
        // console.log(data)
        editBillsData = data
        this.setState({ showEditBillsDrawer: true, })
    }

    hideEditBillsDrawer = () => {
        this.setState({ showEditBillsDrawer: false })
    }

    showCotegoriesHandler = () => {
        this.setState({ showIcon: true })
        if (this.state.categories_obj.length === 0) {
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
                    self.setState({ categories_obj: response.data.value })
                })
        }
    }

    datepickerHandler = (dateString) => {
        this.setState({
            date: new Date(dateString)
        })
    }

    changeToUseCategories = () => {
        this.setState({ editIconsScreen: true })
    }

    showEditIconHandler = () => {
        this.setState({ editIconsScreen: false })
    }

    editBillDataHandler = () => {
        this.props.history.push({
            pathname: "/Add_details",
            // state: { edit: editBillsData }
        })
        localStorage.setItem("edit", "edit");
        localStorage.setItem('testObject', JSON.stringify(editBillsData));

    }

    render() {

        // console.log("--------bills--", editBillsData)

        var categorySet = this.state.categories_obj.map(image => {
            return <div style={{ display: "inline", height: "50px" }}>
                <Row onClick={() => this.highliteCategoryImage(image.category_icon, image.category_name, image.category_id)}>
                    <Col span={1}></Col>
                    <Col span={5} >

                        <img key={image}
                            src={require(`../images/icons/${image.category_icon}.png`)}
                            alt="" className="iconsStyles"
                            style={{ margin: "10px" }} />

                    </Col>
                    <Col span={18} style={{ padding: 25, textAlign: "left", }}>
                        {image.category_name}
                    </Col>
                </Row>

                <hr />
            </div>
        })

        return (
            <div style={{ paddingBottom: 35 }}>
                <div className="header_of_home_page" style={{ paddingBottom: 10 }}>
                    <Row style={{ fontSize: 25 }}>
                        <Col span={5} onClick={this.props.menuOpenerHandler} ><img src={menu} alt="menu icon" width="26px" /></Col>
                        <Col span={15} style={{ fontSize: "90%" }}><span>Bills</span></Col>
                        <Col span={4} onClick={this.showDrawerHandler} ><Icon type="plus" style={{ color: "#555555" }} /></Col>
                    </Row>

                </div>
                <hr />

                <Row className="billsDatesStyles" >
                    <Col span={1}></Col>
                    <Col span={12} ><span>Overdue</span></Col>
                    <Col span={10} style={{ textAlign: "right" }}><span>&#8377; {overDueTotal}</span></Col>
                    <Col span={1} ></Col>
                </Row>

                {this.state.overDueDataArray.length === 0 ? <div style={{ paddingTop: 5 }}>
                    <Empty
                        description="No Overdue bills"
                    />
                </div>
                    :
                    this.state.overDueDataArray.map(item =>
                        <Row onClick={() => this.showEditBillsDrawer(item)} style={{ paddingTop: 15, paddingBottom: 15, fontSize: "100%", textAlign: "left" }}>
                            <Col span={1}></Col>
                            <Col span={3} >
                                <img key={item.category_icon} src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="90%" />
                            </Col>
                            <Col span={10} >
                                <Row> <Col span={24}><span><b>{item.bill_name}</b></span></Col></Row>
                                <Row> <Col span={24}><span>{new Date(item.bill_date).getDate() + "-" + months[new Date(item.bill_date).getMonth()] + "-" + new Date(item.bill_date).getFullYear()}</span></Col></Row>
                            </Col>
                            <Col span={9} style={{ textAlign: "right" }}>
                                <div >
                                    <Row> <Col span={24} ><span><b>Rp {item.bill_amount}.00</b></span></Col></Row>
                                    <Row> <Col span={24} style={{ color: "#ff6060" }}><span>{Math.ceil(-(new Date(item.bill_date).getTime() - new Date().getTime()) / (86400000))} Day Over Due</span></Col></Row>
                                </div>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                    )


                }


                <Row className="billsDatesStyles">
                    <Col span={1}></Col>
                    <Col span={12} ><span>Due with in 7 days</span></Col>
                    <Col span={10} style={{ textAlign: "right" }}><span>&#8377; {WithInSevenDaysTotal}</span></Col>
                    <Col span={1} ></Col>
                </Row>

                {this.state.dueWithInSevenDays.length === 0 ? <div style={{ paddingTop: 5 }}>
                    <Empty
                        description="No due bills in 7 days"

                    /></div> :

                    this.state.dueWithInSevenDays.map(item =>
                        <Row onClick={() => this.showEditBillsDrawer(item)} style={{ paddingTop: 15, paddingBottom: 15, fontSize: "100%", textAlign: "left" }}>
                            <Col span={1}></Col>
                            <Col span={3} >
                                <img key={item.category_icon} src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="90%" />
                            </Col>
                            <Col span={10} >
                                <Row> <Col span={24}><span><b>{item.bill_name}</b></span></Col></Row>
                                <Row> <Col span={24}><span>{new Date(item.bill_date).getDate() + "-" + months[new Date(item.bill_date).getMonth()] + "-" + new Date(item.bill_date).getFullYear()}</span></Col></Row>
                            </Col>
                            <Col span={9} style={{ textAlign: "right" }}>
                                <div >
                                    <Row> <Col span={24} ><span><b>Rp {item.bill_amount}.00</b></span></Col></Row>
                                    <Row> <Col span={24}><span>{Math.ceil((new Date(item.bill_date).getTime() - new Date().getTime()) / (86400000))} Left</span></Col></Row>
                                </div>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                    )
                }

                <Row className="billsDatesStyles">
                    <Col span={1}></Col>
                    <Col span={12} ><span>Due with in 30 days</span></Col>
                    <Col span={10} style={{ textAlign: "right" }}><span>&#8377;{WithInThirtyDaysTotal}</span></Col>
                    <Col span={1} ></Col>
                </Row>

                {this.state.dueWithInThirtyDays.length === 0 ? <div style={{ paddingTop: 5 }}>
                    <Empty
                        description="No due bills in 30 days"
                    />
                </div> :

                    this.state.dueWithInThirtyDays.map(item =>
                        <Row onClick={() => this.showEditBillsDrawer(item)} style={{ paddingTop: 15, paddingBottom: 15, fontSize: "100%", textAlign: "left" }}>
                            <Col span={1}></Col>
                            <Col span={3} >
                                <img key={item.category_icon} src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="90%" />
                            </Col>
                            <Col span={10} >
                                <Row> <Col span={24}><span><b>{item.bill_name}</b></span></Col></Row>
                                <Row> <Col span={24}><span>{new Date(item.bill_date).getDate() + "-" + months[new Date(item.bill_date).getMonth()] + "-" + new Date(item.bill_date).getFullYear()}</span></Col></Row>
                            </Col>
                            <Col span={9} style={{ textAlign: "right" }}>
                                <div >
                                    <Row> <Col span={24} ><span><b>Rp {item.bill_amount}.00</b></span></Col></Row>
                                    <Row> <Col span={24}><span>{Math.ceil((new Date(item.bill_date).getTime() - new Date().getTime()) / (86400000))} Left</span></Col></Row>
                                </div>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                    )
                }

                <Row className="billsDatesStyles">
                    <Col span={1}></Col>
                    <Col span={12} ><span>Due Over 30 Days</span></Col>
                    <Col span={10} style={{ textAlign: "right" }}><span>&#8377; {GraterThanThirtyDaysTotal}</span></Col>
                    <Col span={1} ></Col>
                </Row>
                {this.state.dueGraterThanThirtyDays.length === 0 ? <div style={{ paddingTop: 5 }}>
                    <Empty
                        description="No due bills over 30 days"
                    />
                </div>
                    :

                    this.state.dueGraterThanThirtyDays.map(item =>
                        <Row onClick={() => this.showEditBillsDrawer(item)} style={{ paddingTop: 15, paddingBottom: 15, fontSize: "100%", textAlign: "left" }}>
                            <Col span={1}></Col>
                            <Col span={3} >
                                <img key={item.category_icon} src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="90%" />
                            </Col>
                            <Col span={10} >
                                <Row> <Col span={24}><span><b>{item.bill_name}</b></span></Col></Row>
                                <Row> <Col span={24}><span>{new Date(item.bill_date).getDate() + "-" + months[new Date(item.bill_date).getMonth()] + "-" + new Date(item.bill_date).getFullYear()}</span></Col></Row>
                            </Col>
                            <Col span={9} style={{ textAlign: "right" }}>
                                <div >
                                    <Row> <Col span={24} ><span><b>Rp {item.bill_amount}.00</b></span></Col></Row>
                                    <Row> <Col span={24}><span>{Math.ceil((new Date(item.bill_date).getTime() - new Date().getTime()) / (86400000))} Left</span></Col></Row>
                                </div>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                    )
                }

                <Drawer
                    placement="right"
                    height={window.innerHeight}
                    width={"100%"}
                    closable={false}
                    onClose={this.hideDrawerHandler}
                    visible={this.state.showDrawer}
                >
                    <div>
                        {this.state.showIcon === false ?
                            <div>
                                <div style={headerDIVstyles}>
                                    <Row >
                                        <Col span={1}></Col>
                                        <Col span={3} onClick={this.hideDrawerHandler}
                                            style={{ fontSize: 25 }}><Icon type="close" /></Col>
                                        <Col span={3}></Col>
                                        <Col span={12} ></Col>
                                        <Col span={4} onClick={this.saveFunctionHandler} style={{ fontSize: 25, textAlign: "right" }}><Icon type="check" /></Col>
                                        <Col span={1}></Col>
                                    </Row>

                                    <Row style={{ marginTop: 10 }}>
                                        <Col span={1}></Col>
                                        <Col span={3} onClick={this.showCotegoriesHandler}>
                                            <img src={require(`../images/icons/${this.state.image}_1.png`)} alt="category" width="90%" />
                                        </Col>
                                        <Col span={5} style={{ paddingLeft: 10 }}>
                                            <input
                                                name="payee"
                                                maxlength="11"
                                                autoComplete="off"
                                                value={this.state.payee}
                                                onChange={this.textFielseHandler}
                                                type="text"
                                                placeholder="Payee"
                                                style={headerTextFieldsStyles} >
                                            </input><br />

                                            <input
                                                name="category"
                                                autoComplete="off"
                                                value={this.state.category}
                                                onChange={this.textFielseHandler}
                                                style={headerTextFieldsStyles}
                                                type="text"
                                            >
                                            </input>
                                        </Col>
                                        <Col span={1}>
                                        </Col>
                                        <Col span={13} style={{ textAlign: "right" }}>
                                            <input
                                                name="amount"
                                                autoComplete="off"
                                                value={this.state.amount}
                                                onChange={this.textFielseHandler}
                                                style={headerLargeTextFieldsStyles}
                                                placeholder="0.0"
                                                type="number"
                                            >
                                            </input>
                                        </Col>
                                        <Col span={1}></Col>
                                    </Row>
                                </div>

                                <div>
                                    <Row style={{ textAlign: "center", }}>
                                        <Col span={1} > </Col>
                                        <Col span={3} style={{ fontSize: 30 }} ><img src={calendar} alt="calander" width="26px" /> </Col>
                                        <Col span={20} style={{ textAlign: "right" }}>
                                            <DatePicker
                                                value={moment(this.state.date)}
                                                onChange={this.datepickerHandler}
                                            />
                                        </Col>
                                    </Row>
                                    <hr />
                                </div>

                                {/* <div>
                                    <Row style={{ textAlign: "center", marginTop: 20 }}>
                                        <Col span={8}>   </Col>
                                        <Col span={8}><img src={bell} alt="camera" width="26px" /> </Col>
                                        <Col span={8}> </Col>
                                    </Row>
                                </div> */}
                            </div>

                            :
                            <div>
                                {this.state.editIconsScreen === true ?

                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ position: "fixed", top: 0, zIndex: 10, backgroundColor: "#ffffff" }}>
                                            <Row style={{ textAlign: "center", height: 60 }}>
                                                <Col span={1} ></Col>
                                                <Col span={5} onClick={this.hideIconDrawer} ><h3 style={{ color: "#71a2f6", paddingTop: 20 }}>Cancel</h3> </Col>
                                                <Col span={12} style={{ marginTop: 15 }}><h2>Select Category</h2></Col>
                                                <Col span={5} onClick={this.showEditIconHandler} ><h3 style={{ color: "#71a2f6", paddingTop: 20 }}>Edit</h3></Col>
                                                <Col span={1}></Col>
                                            </Row>
                                            <hr />
                                        </div>
                                        <div style={{ padding: 10, textAlign: "center", paddingTop: 60 }}>
                                            {categorySet}
                                        </div>
                                    </div>
                                    :

                                    <Show_categories
                                        backToHomeComponant={this.changeToUseCategories}
                                    />
                                }

                            </div>
                        }
                    </div>
                </Drawer>

                <Drawer
                    placement="right"
                    height={window.innerHeight}
                    width={"100%"}
                    closable={false}
                    onClose={this.hideDrawerHandler}
                    visible={this.state.showEditBillsDrawer}
                >
                    <div>
                        <div style={{ position: "sticky", top: "0px", zIndex: 1, backgroundColor: "#ffffff" }}>
                            <Row style={{ textAlign: "center", height: 60, zIndex: 10 }}>
                                <Col span={1} ></Col>
                                <Col span={3} onClick={this.hideEditBillsDrawer}><Icon type="left" style={{ fontSize: 20, marginTop: 20 }} /></Col>
                                <Col span={3} ></Col>
                                <Col span={13} style={{ marginTop: 15 }}>
                                </Col>
                                <Col span={3}></Col>
                                <Col span={1}></Col>
                            </Row>
                            <hr />
                        </div>
                        {this.state.showEditBillsDrawer ?
                            <div>
                                <Row >
                                    <Col span={1}></Col>
                                    <Col span={21} style={{ textAlign: "right", color: "#c8c8c8" }}>Due</Col>
                                    <Col span={2}></Col>
                                </Row>

                                <Row style={{ fontSize: "100%", textAlign: "left" }}>
                                    <Col span={1}></Col>
                                    <Col span={3} >
                                        <img key={editBillsData.category_icon} src={require(`../images/icons/${editBillsData.category_icon}.png`)} alt="" width="100%" />
                                    </Col>
                                    <Col span={8} style={{ paddingTop: 8, fontSize: "140%", textAlign: "center" }}>
                                        {editBillsData.bill_name}
                                    </Col>
                                    <Col span={10} style={{ paddingTop: 0, fontSize: "200%", textAlign: "right" }}>{editBillsData.bill_amount}</Col>
                                    <Col span={2}></Col>
                                </Row>

                                <hr style={{ margin: 10 }} />

                                <Row style={{ fontSize: "200%", textAlign: "right" }}>
                                    <Col span={12} className="sideBorder billsFonts">
                                        <Row >
                                            <Col span={20} >Total</Col>
                                            <Col span={4}> </Col>
                                        </Row>
                                        <Row >
                                            <Col span={20} style={{ color: "#5B5B5B" }}>{editBillsData.bill_amount - editBillsData.paid_bill} </Col>
                                            <Col span={4}> </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12} className="billsFonts" >
                                        <Row >
                                            <Col span={20} >Paid</Col>
                                            <Col span={4}> </Col>
                                        </Row>
                                        <Row style={{ color: "#5B5B5B" }}>
                                            <Col span={20}>{editBillsData.paid_bill === "" ? 0 : editBillsData.paid_bill}</Col>
                                            <Col span={4}> </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <hr style={{ margin: 10 }} />
                            </div>
                            : null}
                    </div>
                    <button onClick={this.editBillDataHandler} className="paybillsStyles">Pay Bill</button>
                </Drawer>
            </div>
        );
    }
}
export default (Bills);