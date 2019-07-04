import React, { PureComponent } from 'react';
import '../index.css';
import { Drawer, Row, Col, Button, Icon, DatePicker, Switch, Modal } from 'antd';
import moment from 'moment';
import axios from 'axios';
import camera from '../images/camera.png';
import edit from '../images/edit.png';
import star from '../images/General.png'
import accountimg from '../images/id-card.png';
import clearedImg from '../images/test.png';
import calendar from '../images/calendar.png';
import Show_categories from './Show_categories';
import { Plugins, CameraResultType } from '@capacitor/core';

import { css } from '@emotion/core';
import { SyncLoader } from 'react-spinners';
import Calander from './Calander';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;


const { Camera } = Plugins;
const ButtonGroup = Button.Group;
const  url = "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/"
var expense_obj = [];
var income_obj = [];


class Add_details extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showAccountCategoryDrawer: false,
            useOrEditCategories: "use",
            incomeButtonStyles: {
                backgroundColor: "#f48181",
                color: "#ffffff",
                float: "right",
                boxShadow: "none"
            },

            expenseButtonStyles: {
                backgroundColor: "#ffffff",
                color: "#f48181",
                float: "left",
                boxShadow: "none"
            },

            headerDIVstyles: {
                backgroundColor: "#FE7364",
                textAlign: "center",
                paddingTop: 20,
                paddingBottom: 20,
                color: "#ffffff",
            },

            headerTextFieldsStyles: {
                border: "none",
                outline: "none",
                backgroundColor: "#FE7364",
                color: "#ffffff"
            },

            headerTextFieldsStylesDescription: {
                border: "none",
                outline: "none",
                width: "100%",
            },

            headerLargeTextFieldsStyles: {
                border: "none",
                outline: "none",
                backgroundColor: "#FE7364",
                color: "#ffffff",
                height: 50,
                fontSize: 50,
                width: "100%",
                textAlign: "right"
            },

            buttongroup: {
                backgroundColor: "#f48181",
                borderRadius: 20,
                height: "33px",
                width: 160,

            },
            mode: "Add_details",
            incomeOrExpense: "Expense",
            amount: "",
            payee: "",
            date: new Date(),
            // account: "",
            status: "cleared",
            status_for_switch: true,
            picture: camera,
            drawer: "category",
            description: "",
            default_account: localStorage.getItem('default_account_v2'),
            user_id: localStorage.getItem('user_id_v2'),
            user_password: localStorage.getItem('user_password_v2'),
            accountsArray: [],
            selected: "General",
            category: "Others",
            category_id: "44",//---------category id for Others in expense-------
            editCategoryArray: {},
            autoid: "",
            modelVisible: false,
            billId:"0",
        }
        this.photoHandler = this.photoHandler.bind(this);
    }

    componentWillMount() {

        if (localStorage.getItem("edit") !== "NotEdit") {
            console.log("---editData---");
            let editData = JSON.parse(localStorage.getItem('testObject'));
            var arr = Object.keys(editData)

            console.log("---editData---", editData);

            if (arr.includes("bill_id")) {
                localStorage.setItem('backToPerticularBill','backToPerticularBill');

                this.setState({
                    mode: "Edit_from_bills",
                    payee: editData.bill_name,
                    amount: editData.bill_amount,
                    category: editData.category_name,
                    category_id: editData.category_id,
                    selected: editData.category_icon,
                    billId: editData.bill_id,
                })
               console.log("---editData.bill_id---", editData.bill_id);
            }
            else {

                if (editData.type === "Income") { this.incomeButtonHandler() }
                this.setState({
                    mode: "Edit",
                    picture: editData.attachment,
                    payee: editData.payee,
                    amount: editData.amount,
                    date: new Date(editData.date),
                    description: editData.description,
                    default_account: editData.account_type_id,
                    autoid: editData.autoid,
                    category: editData.category_name,
                    category_id: editData.category_id,
                    selected: editData.category_icon,
                })
                if (editData.status === "cleared") {
                    this.setState({ status: "cleared", status_for_switch: true })
                }
                else {
                    this.setState({ status: "Uncleared", status_for_switch: false })
                }
            }
        }
        console.log("---editData--3333-");
    }

    deleteBill = () => {
        console.log("--------this-------is---working")

    }

    addAccountHandler = () => {
        this.props.history.push({ pathname: "/Add_account" })
    }

    selectAccountHandler = (account) => {
        this.setState({ default_account: account, showAccountCategoryDrawer: false })
        localStorage.setItem('default_account_v2', account);
    }

    async photoHandler() {

        this.setState({ modelVisible:false })

        let self = this;
        const image = await Camera.getPhoto({
            quality: 20,
            resultType: CameraResultType.Base64
        });
        var imageUrl = "data:image/png;base64," + image.base64String;
        console.log("-----------photo---url----", imageUrl)
        self.setState({ picture: imageUrl });

    }

    changeAccountHandler = () => {
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
                self.setState({ drawer: "account", accountsArray: response.data.value, showAccountCategoryDrawer: true })
            })
    }

    toggleSwitshHandler = (e) => {
        if (e === true) {
            this.setState({ status: "cleared", status_for_switch: true })
        }
        else {
            this.setState({ status: "Uncleared", status_for_switch: false })
        }
    }

    showCotegoriesHandler = () => {
        this.setState({ drawer: "category", showAccountCategoryDrawer: true })
        if (expense_obj.length === 0) {
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
                    expense_obj = response.data.value.filter(word => word.category_group == "Expense");
                    income_obj = response.data.value.filter(word => word.category_group == "Income");
                    self.setState({ categoriesOraddCategory: "category", })
                })
        }
    }

    hideSettingsDrawerHandler = () => {
        this.setState({ showAccountCategoryDrawer: false })
    }

    changeToUseCategories = () => {
        this.setState({ useOrEditCategories: "use" })
    }

    expenseButtonHandler = () => {

        this.setState({
            category_id: "44",
            selected: "General",
            category: "Others",
            incomeOrExpense: "Expense",
            incomeButtonStyles: {
                backgroundColor: "#f48181",
                color: "#ffffff",
                float: "right",
                boxShadow: "none"
            },

            expenseButtonStyles: {
                backgroundColor: "#ffffff",
                color: "#f48181",
                float: "left",
                boxShadow: "none"
            },

            headerDIVstyles: {
                backgroundColor: " #FE7364",
                textAlign: "center",
                paddingTop: 20,
                paddingBottom: 20,
                color: "#ffffff",
            },
            headerTextFieldsStyles: {
                border: "none",
                outline: "none",
                backgroundColor: "#FE7364",
                color: "#ffffff"

            },
            headerLargeTextFieldsStyles: {
                border: "none",
                outline: "none",
                backgroundColor: "#FE7364",
                color: "#ffffff",
                height: 50,
                fontSize: 50,
                width: 150,
                textAlign: "right"
            },
            buttongroup: {
                width: 160,
                backgroundColor: "#f48181",
                borderRadius: 20,
                height: "33px"
            },
        })
    }
    handleCancelPictureModel = () => {
        this.setState({ modelVisible: false })
    }

    photoHandlerOrviewPhoto = () => {
        
        if (this.state.picture === camera) {
            this.photoHandler()
            
        }
        else {
            this.setState({ modelVisible: true })
        }

    }

    textFielseHandler = (event) => {

        if (event.target.name === "amount") {
            if (String(event.target.value).length <= 7) {
                this.setState({ [event.target.name]: event.target.value })
            }
        }
        else {
            this.setState({ [event.target.name]: event.target.value })
        }
    }

    incomeButtonHandler = () => {
        this.setState({
            category_id: "45",
            selected: "General",
            category: "Others",
            incomeOrExpense: "Income",
            expenseButtonStyles: {
                backgroundColor: "#56de9c",
                color: "#ffffff",
                float: "left",
                boxShadow: "none"
            },
            incomeButtonStyles: {
                backgroundColor: "#ffffff",
                color: "#56de9c",
                float: "right",
                boxShadow: "none"
            },

            headerDIVstyles: {
                backgroundColor: " #4cd964",
                textAlign: "center",
                paddingTop: 20,
                paddingBottom: 20,
                color: "#ffffff",
            }
            ,
            headerTextFieldsStyles: {
                border: "none",
                outline: "none",
                backgroundColor: "#4cd964",
                color: "#ffffff"
            },
            headerLargeTextFieldsStyles: {
                border: "none",
                outline: "none",
                backgroundColor: "#4cd964",
                color: "#ffffff",
                height: 50,
                fontSize: 50,
                width: 150,
                textAlign: "right"
            },
            buttongroup: {
                width: 160,
                backgroundColor: "#56de9c",
                borderRadius: 20,
                height: "33px"
            },
        })
    }

    editIconsHandler = () => { this.setState({ useOrEditCategories: "Edit" }) }

    closeButtonHandler = () => {
        this.props.history.push({ pathname: "/Home" })
    }

    datepickerHandler = (e) => {
        this.setState({ date: new Date(e) })
    }

    highliteCategoryImage = (icon, name, id) => {
        this.setState({ selected: icon, category: name, category_id: id })
        console.log("------------id-------", id)
        this.hideSettingsDrawerHandler()
    }

    saveFunctionHandler = () => {

        let profile_obj = {}

        let date = new Date(this.state.date)
        let month = date.getMonth() + 1

        if (month < 10) { month = "0" + month }
        let day = date.getDate()

        if (day < 10) { day = "0" + day }
        date = String(date.getFullYear() + "-" + month + "-" + day)

        if (this.state.amount !== "" && this.state.picture !== camera && this.state.payee !== "" && this.state.description !== "") {

            

            this.setState({ loading: true })

            profile_obj.autoid = this.state.autoid;
            profile_obj.account_id = this.state.user_id;
            profile_obj.type = this.state.incomeOrExpense;
            profile_obj.date = date;
            profile_obj.time = this.state.date;
            profile_obj.amount = this.state.amount;
            profile_obj.payee = this.state.payee;
            profile_obj.category_id = this.state.category_id;
            profile_obj.category_name = this.state.category;
            profile_obj.paymentmethods = "";
            profile_obj.bill = this.state.billId;
            profile_obj.status = this.state.status;
            profile_obj.account_type_id = this.state.default_account;
            profile_obj.description = this.state.description;
            profile_obj.attachment = this.state.picture;
            if (this.state.mode === "Edit") {
                profile_obj.attachment = undefined;
            }
            profile_obj.createdby = this.state.user_id;
            profile_obj.createdtimestamp = new Date();
            profile_obj.updatedby = this.state.user_id;
            profile_obj.updatedtimestamp = "";

            if (this.state.mode === "Edit") {
                var url_loadmoar = url + "PersonalAccs('" + (this.state.autoid) + "')"
                var method = 'put'
            }
            else {
                var url_loadmoar = url + "PersonalAccs";
                var method = 'post'
            }
            let self = this;


            console.log("--url_loadmoar--", url_loadmoar)
            console.log("--url_loadmoar--", profile_obj)


            axios({
                method: method,
                url: url_loadmoar,
                data: profile_obj,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Basic " + this.state.user_password,
                    'Content-Type': 'application/json'
                },
            })
                .then(function (response) {
                    if (self.state.mode === "Edit_from_bills") {
                        let editData = JSON.parse(localStorage.getItem('testObject'));
                        var amount = editData.bill_amount - editData.paid_bill

                        if (amount < self.state.amount) {
                            self.deleteBill()
                        }
                    }

                    self.setState({
                        incomeOrExpense: "Expense",
                        amount: "",
                        payee: "",
                        date: new Date(),
                        status: "cleared",
                        status_for_switch: true,
                        picture: camera,
                        drawer: "category",
                        description: "",
                        selected: "General",
                        category: "Others",
                        category_id: "44",
                        loading: false
                    })


                    self.props.history.push({ pathname: "/Home" })

                })
                .catch(e => {
                    let error_message = e.response.data
                    error_message = error_message.error.message
                    // alert(error_message);
                    self.setState({ loading: false })
                });
        }
        else {
            alert("Please enter mandatory fields")
        }
    }

    render() {

        console.log("----------mode-------", this.state.mode)
        // const settings = {
        //     dots: true,
        //     infinite: true,
        //     speed: 500,
        //     slidesToShow: 1,
        //     slidesToScroll: 1
        // };

        if (this.state.incomeOrExpense === "Expense") {
            var categoryObj = expense_obj;
            var payeerOrpayer = "Payer"
        }
        else {
            var categoryObj = income_obj;
            var payeerOrpayer = "Payee"
        }
        var categorySet = categoryObj.map(image => {
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
            <div>

                {!this.state.loading ?
                    <div>
                        <div
                            style={this.state.headerDIVstyles}
                        >
                            <Row >
                                <Col span={1}></Col>
                                <Col span={3} onClick={this.closeButtonHandler}
                                    style={{ fontSize: 25 }}><Icon type="close" /></Col>
                                <Col span={3}></Col>
                                <Col span={12} >
                                    <div style={this.state.buttongroup}>
                                        <ButtonGroup >
                                            <Button style={this.state.expenseButtonStyles} onClick={this.expenseButtonHandler}>Expense</Button>
                                            <Button style={this.state.incomeButtonStyles} onClick={this.incomeButtonHandler}>Income</Button>
                                        </ButtonGroup>
                                    </div>
                                </Col>
                                <Col span={4} onClick={this.saveFunctionHandler} style={{ fontSize: 25, textAlign: "right" }}><Icon type="check" /></Col>
                                <Col span={1}></Col>
                            </Row>

                            <Row style={{ marginTop: 10 }}>
                                <Col span={1}></Col>
                                <Col span={3} onClick={this.showCotegoriesHandler}>
                                    <img src={require(`../images/icons/${this.state.selected}_1.png`)} alt="" width="90%" />
                                </Col>
                                <Col span={5} style={{ paddingLeft: 10 }}>

                                    <input
                                        maxlength="11"
                                        autoComplete="off"
                                        name="payee"
                                        value={this.state.payee}
                                        onChange={this.textFielseHandler}
                                        type="text"
                                        placeholder={payeerOrpayer}
                                        style={this.state.headerTextFieldsStyles} >
                                    </input><br />

                                    <input
                                        maxlength="11"
                                        name="category"
                                        autoComplete="off"
                                        value={this.state.category}
                                        // onChange={this.textFielseHandler}
                                        style={this.state.headerTextFieldsStyles}
                                        type="text"
                                        placeholder="Others"
                                    >
                                    </input>
                                </Col>
                                <Col span={1}>
                                </Col>
                                <Col span={13} style={{ textAlign: "right" }}>
                                    <input
                                        name="amount"
                                        value={this.state.amount}
                                        onChange={this.textFielseHandler}
                                        style={this.state.headerLargeTextFieldsStyles}
                                        placeholder="0.0"
                                        type="number"
                                        autoComplete="off"
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

                        <div>
                            <Row style={{ textAlign: "center", }} onClick={this.changeAccountHandler}>
                                <Col span={1} > </Col>
                                <Col span={3} style={{ fontSize: 30 }} ><img src={accountimg} alt="accountimg" width="30px" /></Col>
                                <Col span={17} style={{ textAlign: "left", height: 50, paddingTop: 15, paddingLeft: 11 }} >
                                    <span >{this.state.default_account}</span>
                                </Col>
                                <Col span={3} >

                                </Col>
                            </Row>
                            <hr />
                        </div>

                        <div>
                            <Row style={{ textAlign: "center", }}>
                                <Col span={1} > </Col>
                                <Col span={3} style={{ fontSize: 30 }} ><img src={clearedImg} alt="clearedImg" width="26px" /></Col>
                                <Col span={15} style={{ textAlign: "left", height: 50, paddingTop: 15, paddingLeft: 11 }}>
                                    <span >Cleared</span>
                                </Col>
                                <Col span={5} style={{ marginTop: 10, marginBottom: 10 }}>
                                    <Switch checked={this.state.status_for_switch} onChange={this.toggleSwitshHandler} />
                                </Col>
                            </Row>
                            <hr />
                        </div>


                        <div>
                            <Row style={{ textAlign: "center", }} >
                                <Col span={1} > </Col>
                                <Col span={3} style={{ fontSize: 30 }} ><img src={edit} alt="edit" width="26px" /> </Col>
                                <Col span={17} style={{ textAlign: "left", height: 50, paddingTop: 15, paddingLeft: 11 }} >
                                    <input
                                        autoComplete="off"
                                        className="change"
                                        name="description"
                                        style={this.state.headerTextFieldsStylesDescription}
                                        value={this.state.description}
                                        onChange={this.textFielseHandler}
                                        type="text"
                                        placeholder="Description"
                                    >
                                    </input>
                                </Col>
                                <Col span={3} >

                                </Col>
                            </Row>
                            <hr />
                        </div>

                        <div>
                            <Row style={{ textAlign: "center", marginTop: 20 }} onClick={this.photoHandlerOrviewPhoto}>
                                <Col span={8}>   </Col>
                                <Col span={8}> <img src={this.state.picture} alt="camera" width="26px" /></Col>
                                <Col span={8}>  </Col>
                            </Row>
                        </div>

                        <Drawer
                            placement="right"
                            height={window.innerHeight}
                            width={"100%"}
                            closable={false}
                            onClose={this.hideSettingsDrawerHandler}
                            visible={this.state.showAccountCategoryDrawer}
                        >
                            {
                                (this.state.drawer === "account")
                                    ?
                                    <div>
                                        <Row style={{ textAlign: "center", height: 60, paddingTop: 15 }}>
                                            <Col span={1} ></Col>
                                            <Col span={3} onClick={this.hideSettingsDrawerHandler}><Icon type="left" style={{ fontSize: 24, color: "#71a2f6", paddingTop: 8 }} /></Col>
                                            <Col span={16} ><label> Account</label></Col>
                                            <Col span={4} onClick={this.addAccountHandler}>
                                                <Icon type="plus" style={{ fontSize: 26, color: "#71a2f6", paddingTop: 5 }} />
                                            </Col>
                                        </Row>
                                        <div>
                                            {this.state.accountsArray.map((item) =>
                                                <Row >
                                                    <Col span={2} ></Col>
                                                    <Col span={20}>
                                                        <Row style={{ backgroundColor: item.color, borderRadius: 5, padding: 5, margin: 5 }}
                                                            onClick={() => this.selectAccountHandler(item.account_type_name)}
                                                        >
                                                            <Col span={1}></Col>
                                                            <Col span={7} >
                                                                <img className="iconsStyles"
                                                                    src={require(`../images/icons/${item.account_type_dec}_1.png`)}
                                                                />
                                                            </Col>
                                                            <Col span={16}>
                                                                <lable style={{ fontSize: "150%", color: "#ffffff" }}>  {item.account_type_name}</lable>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={2} ></Col>
                                                </Row>
                                            )
                                            }
                                        </div>
                                    </div>

                                    :
                                    <div>
                                        {(this.state.useOrEditCategories === "use") ?
                                            <div style={{ textAlign: "center" }}>
                                                <div style={{ position: "fixed", top: 0, zIndex: 10, backgroundColor: "#ffffff" }}>
                                                    <Row style={{ textAlign: "center", height: 60 }}>
                                                        <Col span={1} ></Col>
                                                        <Col span={5} onClick={this.hideSettingsDrawerHandler} ><h3 style={{ color: "#71a2f6", paddingTop: 20 }}>Cancel</h3> </Col>
                                                        <Col span={12} style={{ marginTop: 15 }}><h2>Select Category</h2></Col>
                                                        <Col span={5} onClick={this.editIconsHandler} ><h3 style={{ color: "#71a2f6", paddingTop: 20 }}>Edit</h3></Col>
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
                        </Drawer>
                    </div>

                    :

                    <div className='sweet-loading' style={{ textAlign: "center", position: "fixed", top: "50%" }}>
                        <SyncLoader
                            css={override}
                            sizeUnit={"px"}
                            size={15}
                            color={'#36D7B7'}
                            loading={this.state.loading}
                        />

                    </div>

                }


                <Modal
                    title="Picture"
                    onCancel={this.handleCancelPictureModel}
                    visible={this.state.modelVisible}
                    footer={[
                        <Button key="back" onClick={this.handleCancelPictureModel}>
                            Cancil
            </Button>,
                        <Button key="submit" type="primary" onClick={this.photoHandler}>
                            Edit
            </Button>,
                    ]}
                >
                    <img src={this.state.picture} alt="camera" width="100%" height="300px" />
                </Modal>


            </div>
        )

    }
}

export default (Add_details);