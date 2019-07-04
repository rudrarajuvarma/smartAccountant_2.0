import React, { Component } from 'react'
import Add_categories from './Add_categories';
import { Button, Row, Col, Icon } from 'antd';
import axios from 'axios';

const url = "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/"
const ButtonGroup = Button.Group;
var expense_obj = [];
var income_obj = [];
var catagoryIdNew;

export default class Show_categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoriesOrEditCategories: "category",
            incomeOrExpense: "Expense",
            user_password: localStorage.getItem('user_password_v2'),
            editCategoryArray: {},
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
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
                width: 160,
            },

        }
    }

    goBackToCategoriesHandler = () => {
        this.componentDidMount()
         }

    componentDidMount() {
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
                catagoryIdNew = (response.data.value.length + 1)
                expense_obj = response.data.value.filter(word => word.category_group == "Expense");
                income_obj = response.data.value.filter(word => word.category_group == "Income");
                self.setState({ categoriesOrEditCategories: "category", })
            })
    }


    incomeButtonHandler = () => {
        this.setState({
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
                height: "33px"
            },

        })
    }


    expenseButtonHandler = () => {
        this.setState({
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
                height: "33px"
            },
        })
    }

    editCategoryHandler = (item) => {
        this.setState({ editCategoryArray: item, categoriesOrEditCategories: "addCategory" })
    }

    toAddCatagoryhandler = () => {
        this.setState({ categoriesOrEditCategories: "addCategory", editCategoryArray: {} })
    }

    render() {
        if (this.state.incomeOrExpense == "Expense") {
            var img = expense_obj.map(item => {
                return <div onClick={() => this.editCategoryHandler(item)}> <Row style={{ zIndex: 0 }}>
                    <Col span={1}></Col>
                    <Col span={4}>
                        <img key={item.category_icon} src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="50px" style={{ margin: "10px" }} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11} style={{ paddingTop: 25, textAlign: "left", fontSize: "120%" }}><span>{item.category_name}</span></Col>
                    <Col span={7}></Col>
                </Row><hr />
                </div>
            });
        }
        else {
            
            var img = income_obj.map(item => {
                return <div onClick={() => this.editCategoryHandler(item)}> <Row style={{ zIndex: 0 }}>
                    <Col span={1}></Col>
                    <Col span={4}>
                        <img key={item.category_icon} src={require(`../images/icons/${item.category_icon}.png`)} alt="" width="50px" style={{ margin: "10px" }} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11} style={{ paddingTop: 25, textAlign: "left", fontSize: "120%" }}><span>{item.category_name}</span></Col>
                    <Col span={7}></Col>
                </Row><hr />
                </div>
            });
        }

        return (
            <div>
                {this.state.categoriesOrEditCategories === "category"
                    ?
                    <div>
                        <div className="header_of_home_page">
                            <Row  style={{ paddingTop:8,paddingBottom:10}}>
                                <Col span={1} ></Col>
                                <Col span={3} onClick={this.props.backToHomeComponant} style={{paddingTop:"5px"}}><Icon type="left" style={{ fontSize: "150%"}} /></Col>
                                <Col span={3} ></Col>
                                <Col span={13}>
                                    <div style={this.state.buttongroup}>
                                        <ButtonGroup >
                                            <Button style={this.state.expenseButtonStyles} onClick={this.expenseButtonHandler}>Expense</Button>
                                            <Button style={this.state.incomeButtonStyles} onClick={this.incomeButtonHandler}>Income</Button>
                                        </ButtonGroup>
                                    </div></Col>
                                <Col span={3} style={{ fontSize: "150%"}} onClick={this.toAddCatagoryhandler}><Icon type="plus" /></Col>
                                <Col span={1}></Col>
                            </Row>
                            <hr />
                        </div>
                        <div style={{ padding: 10, textAlign: "center", }}>
                            {img}
                        </div>
                    </div>
                    :
                    <Add_categories
                        editCategoryArray={this.state.editCategoryArray}
                        catagoryIdNew={catagoryIdNew}
                        goBackToCategoriesHandler={this.goBackToCategoriesHandler}
                    />
                }
            </div>
        )
    }
}
