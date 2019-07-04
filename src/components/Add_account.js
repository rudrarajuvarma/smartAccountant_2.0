import React, { Component } from 'react';
import { Drawer, Row, Col, Button, Icon, Switch } from 'antd';
import calendar from '../images/calendar.png';
import moment from 'moment';
import { DatePicker } from 'antd';
import clearedImg from '../images/test.png';
import paint from '../images/paint.png';
import axios from 'axios';
import Show_categories from './Show_categories';

const colors1 = ["#FF6900", "#FCB900", "#7BDCB5", "#00D084", "#8ED1FC",]
const colors2 = ["#0693E3", "#ABB8C3", "#EB144C", "#F78DA7", "#9900EF"]

var categorySet= []

class Add_details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            useOrEditCategories: "use",
            selected: "General",
            showAccountCategoryDrawer: false,
            category: "",
            user_password: localStorage.getItem('user_password_v2'),
            user_id: localStorage.getItem('user_id_v2'),
            showDrawer: false,
            account_name: '',
            backgroundColor: "#FF6900",
            date: new Date(),
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
                color: "#ffffff",
                textTransform: 'capitalize',
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
        }
    }

    saveFunctionHandler = () => {

        if (this.state.account_name !== "") {

          var  profile_obj = {};
            profile_obj.account_type_id = ""
            profile_obj.account_type_name = this.state.account_name
            profile_obj.account_type_dec = this.state.selected
            profile_obj.color = this.state.backgroundColor
            profile_obj.createdby = this.state.user_id;
            profile_obj.createdtimestamp = new Date()
            profile_obj.updatedby = this.state.user_id;
            profile_obj.updatedtimestamp = ""

            console.log("----------input obj-------", profile_obj)

            let self = this;
            axios({
                method: 'post',
                url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/AccountTypes",
                data: profile_obj,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Basic " + this.state.user_password,
                    'Content-Type': 'application/json'
                },
            })
                .then(function (response) {



                })

        }

    }
    
    changeToUseCategories = () => {
        this.setState({ useOrEditCategories: "use" })
    }
    editIconsHandler = () => { this.setState({ useOrEditCategories: "Edit" })}

    hideSettingsDrawerHandler = () => {
        this.setState({ showAccountCategoryDrawer: false })
    }
    highliteCategoryImage = (icon, name) => {
        this.setState({ selected: icon, category: name, })
        this.hideSettingsDrawerHandler()
    }

    textFielseHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    hideDrawerHandler = () => {
        this.setState({ showDrawer: false, })
    }
    showDrawerHandler = () => {
        this.setState({ showDrawer: true, })
    }
    closeButtonHandler = () => {
        this.props.history.push({ pathname: "/Add_details"})
    }

    // datepickerHandler = (dateString) => {
    //     this.setState({
    //         date: dateString
    //     })
    // }

    changeBackGroundHandler = (arg) => {
        this.setState({ backgroundColor: arg, showDrawer: false })
    }

    showCotegoriesHandler = () => {
        this.setState({ showAccountCategoryDrawer: true })
        if (categorySet.length === 0) {
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
                   categorySet  = response.data.value
                    self.setState({ categoriesOraddCategory: "category" })
                })
        }
    }


    render() {
       
        var categorySet_res = categorySet.map(image => {
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
                <div style={this.state.headerDIVstyles}>

                    <Row style={{ fontSize: 25, }}>
                        <Col span={1}></Col>
                        <Col span={3} onClick={this.closeButtonHandler}
                        ><Icon type="close" /></Col>
                        <Col span={3}></Col>
                        <Col span={12} >
                        </Col>
                        <Col span={4} onClick={this.saveFunctionHandler} style={{ textAlign: "right" }}><Icon type="check" /></Col>
                        <Col span={1}></Col>
                    </Row>


                    <Row style={{ marginTop: 10 }}>
                        <Col span={1}></Col>
                        <Col span={3} onClick={this.showCotegoriesHandler}>
                            <img src={require(`../images/icons/${this.state.selected}_1.png`)} alt="" width="90%" />
                        </Col>
                        <Col span={9} style={{ paddingLeft: 10 }}>

                            <input
                                name="account_name"
                                placeholder="Account name"
                                autoComplete="off"
                                value={this.state.account}
                                onChange={this.textFielseHandler}
                                type="text"
                                style={this.state.headerTextFieldsStyles}
                            >
                            </input><br />

                            <input
                                name="category"
                                autoComplete="off"
                                value={this.state.category}
                                style={this.state.headerTextFieldsStyles}
                                type="text"
                                placeholder="Others"
                            >
                            </input>
                        </Col>

                        <Col span={10} style={{ textAlign: "right" }}>
                            {/* <input
                                name="amount"
                                autoComplete="off"
                                value={this.state.amount}
                                onChange={this.textFielseHandler}
                                style={this.state.headerLargeTextFieldsStyles}
                                placeholder="0.0"
                                type="number"
                            >
                            </input> */}
                        </Col>
                        <Col span={1}></Col>
                    </Row>

                </div>
                {/* <div>
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
                </div> */}
                {/* // 
// //                 <div>
// //                     <Row style={{ textAlign: "center", }}>
// //                         <Col span={1} > </Col>
// //                         <Col span={3} style={{ fontSize: 30 }} ><img src={clearedImg} alt="clearedImg" width="26px" /></Col>
// //                         <Col span={15} style={{ textAlign: "left", height: 50, paddingTop: 15, paddingLeft: 11 }}>
// //                             <span >Auto-Cleard</span>
// //                         </Col>
// //                         <Col span={5} style={{ marginTop: 10, marginBottom: 10 }}>
// //                             <Switch defaultChecked={this.state.status} onChange={this.toggleSwitshHandler} />
// //                         </Col>
// //                     </Row>
// //                     <hr />
// //                 </div> */}


                <div>
                    <Row style={{ textAlign: "center", }}>
                        <Col span={1} > </Col>
                        <Col span={3} style={{ fontSize: 30 }} ><img src={paint} alt="paint" width="26px" /></Col>
                        <Col span={15} style={{ textAlign: "left", height: 50, paddingTop: 15, paddingLeft: 11 }}>
                            <span >Backgorund Color</span>
                        </Col>
                        <Col span={4} style={{ marginTop: 10, marginBottom: 10, }} onClick={this.showDrawerHandler}>
                            <div style={{ width: 25, height: 25, backgroundColor: this.state.backgroundColor, borderRadius: 4, float: "right", }}></div>
                        </Col>
                        <Col span={1} > </Col>
                    </Row>
                    <hr />
                </div>

                <Drawer
                    placement="bottom"
                    height={(window.innerHeight / 2)}
                    closable={false}
                    onClose={this.hideDrawerHandler}
                    visible={this.state.showDrawer}
                >
                    <Row className="header_of_home_page">
                        <Col span={1} > </Col>
                        <Col span={22} style={{ textAlign: "center", fontSize: 22 }}>Select Color</Col>
                        <Col span={1} > </Col>
                    </Row>
                    <br />
                    <Row  >
                        <Col span={1} > </Col>
                        {colors1.map((item) =>
                            <Col span={4} style={{ marginTop: 10, marginBottom: 10, }} onClick={() => this.changeBackGroundHandler(item)}>
                                <div style={{ width: 25, height: 25, backgroundColor: item, borderRadius: 4, float: "right", }}></div>
                            </Col>
                        )}
                        <Col span={2} > </Col>
                    </Row>

                    <Row  >
                        <Col span={1} > </Col>
                        {colors2.map((item) =>
                            <Col span={4} style={{ marginTop: 10, marginBottom: 10, }} onClick={() => this.changeBackGroundHandler(item)}>
                                <div style={{ width: 25, height: 25, backgroundColor: item, borderRadius: 4, float: "right", }}></div>
                            </Col>
                        )}
                        <Col span={2} > </Col>
                    </Row>

                </Drawer>

                <Drawer
                    placement="right"
                    height={window.innerHeight}
                    width={"100%"}
                    closable={false}
                    onClose={this.hideSettingsDrawerHandler}
                    visible={this.state.showAccountCategoryDrawer}
                >
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
                            {categorySet_res}
                        </div>
                    </div>
                    :
                     <Show_categories
                    backToHomeComponant={this.changeToUseCategories}
                    />
                     }
                </Drawer>

            </div>
        );
    }
}
export default (Add_details);