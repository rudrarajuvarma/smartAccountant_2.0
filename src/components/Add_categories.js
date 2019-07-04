import React, { PureComponent } from 'react';
import { Button, Drawer, Row, Col, Icon, Modal } from 'antd';
import axios from 'axios';
import Slider from "react-slick";

const icons1 = ["Account_Transfer", "Bag", "Baloon", "Bell", "Bin", "Book", "Boot", "Brush", "Burger", "Bus", "Call", "Cam", "Car", "Card", "Cart", "Chicken_Leg",]
const icons2 = ["Clothes", "Cock", "Cup", "Dog", "Drier", "Dumbel", "Eating_Out", "Education", "Entertainment", "Equities", "Farming", "First_Aid", "Fruit", "Fuel", "Game", "Gas",]
const icons3 = ["General", "Gifts", "Hanger", "Heart", "Hed_Set", "Holidays", "Home_equity", "Id", "Injuction", "Investment", "Joker", "Kids", "Life", "Light", "Lip_Stick", "Mail"]
const icons4 = ["Mike", "Milk", "Mug", "Notefication_Bell", "Paint", "Part-time_Work", "Paw", "Percent", "Personal_Savings", "Rents_Royalties", "Ring", "Rome", "Safa", "Salary", "Ship", "Shopping"]
const icons5 = ["Sports", "Teeth", "Temple", "Travel", "Tv", "Umbrella", "Water", "Wifi"]

var editingObj = {}

const textField = {
    width: "100%",
    height: 50,
    border: "none",
    outline: "none",
    fontSize: "120%",
    textAlign: "right"
}
const ButtonGroup = Button.Group;

const styles = {
    slide: {
        padding: 15,
        minHeight: 100,
        color: '#fff',
    },

};


class Add_categories extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            categoriesObj:[],
            editCategory_id: "",
            mode: "Create",
            catagoryName: "",
            selected: "General",
            user_password: localStorage.getItem('user_password_v2'),
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
                backgroundColor: "#e6e6e6",
                borderRadius: 20,
                height: "33px",
                width: 160,
                float: "right"
            },
        }
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
        }).then(function (response) {
            self.setState({categoriesObj:response.data.value})
        })


        if (this.props.editCategoryArray.category_id !== undefined) {
            editingObj = this.props.editCategoryArray
            this.setState({
                catagoryName: editingObj.category_name,
                incomeOrExpense: editingObj.category_group,
                selected: editingObj.category_icon,
                mode: "Edit",
                editCategory_id: editingObj.category_id
            })
            if (editingObj.category_group === "Income") {
                this.incomeButtonHandler()
            }
        }

        else {

            console.log("----------else-----------")

            this.setState({ catagoryName: "", selected: "General", incomeOrExpense: "Expense", mode: "Create" })
            this.expenseButtonHandler()
        }

    }

    highliteCategoryImage = (key) => {
        this.setState({ selected: key })
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
                height: "33px",
                float: "right"
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
                height: "33px",
                float: "right"
            },
        })

    }

    textFieldHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

   

    addNewCategoryHandler = () => {
        if (this.state.mode === "Create") {

            if (this.state.catagoryName !== "") {

                console.log(this.state.categoriesObj);
                
                var data=this.state.categoriesObj;
               
                var  country = data.find(el => el.category_name.toUpperCase() === this.state.catagoryName.toUpperCase());
               
                 console.log(country);

if(country.length===0){

    let self=this;
                axios({
                    method: 'post',
                    url: "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Categories",
                    data: {
                        "category_id": self.props.catagoryIdNew.toString(),
                        "category_name": self.state.catagoryName,
                        "category_color": "yellow",
                        "category_icon": self.state.selected,
                        "category_group": self.state.incomeOrExpense,
                        "category_dec": "",
                        "createdby": "",
                        "crestedtimestamp": "",
                        "updatedby": "",
                        "updatedtimestamp": ""
                    },
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': "Basic " + this.state.user_password,
                        'Content-Type': 'application/json'
                    },
                })
                    .then(
                        self.props.goBackToCategoriesHandler
                    )
            }

            else{
                alert("This Category is already Existed")
            }


        }
        
            else { alert("Please add category name") }
        }


        else {

            if (this.state.catagoryName !== "") {
                let self = this;
                var editUrl = "http://49.207.13.36:7070/smartaccountant_dev/AccountService.svc/Categories('" + (self.state.editCategory_id) + "')"
                axios({
                    method: 'put',
                    url: editUrl,
                    data:
                    {
                        "category_id": self.state.editCategory_id,
                        "category_name": self.state.catagoryName,
                        "category_color": "yellow",
                        "category_icon": self.state.selected,
                        "category_group": self.state.incomeOrExpense,
                        "category_dec": "",
                        "createdby": "",
                        "crestedtimestamp": "",
                        "updatedby": "",
                        "updatedtimestamp": ""
                    },
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': "Basic " + this.state.user_password,
                        'Content-Type': 'application/json'
                    },
                })
                    .then(
                        self.props.goBackToCategoriesHandler
                    )

            }

        }

    }


    render() {

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        var sty = { margin: "10px", display: "inline" }
        var sty1 = { margin: "10px", borderRadius: 50, padding: 3, backgroundColor: "#c8c8c8", display: "inline" }
        var set1 = icons1.map(image => {

            return <div style={{ display: "inline" }}>
                {(this.state.selected == image) ?

                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty1} />
                    :
                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty} />

                }

            </div>
        })


        var set2 = icons2.map(image => {

            return <div style={{ display: "inline" }}>
                {(this.state.selected == image) ?
                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty1} />
                    :
                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty} />

                }
            </div>
        })


        var set3 = icons3.map(image => {

            return <div style={{ display: "inline" }}>
                {(this.state.selected == image) ?
                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty1} />
                    :
                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty} />

                }
            </div>
        })
        var set4 = icons4.map(image => {

            return <div style={{ display: "inline" }}>
                {(this.state.selected == image) ?
                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty1} />
                    :
                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty} />
                }
            </div>
        })

        var set5 = icons5.map(image => {

            return <div style={{ display: "inline" }}>
                {(this.state.selected == image) ?
                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty1} />
                    :
                    <img key={image}
                        onClick={() => this.highliteCategoryImage(image)}
                        src={require(`../images/icons/${image}.png`)}
                        alt="" className="iconsStyles"
                        style={sty} />

                }
            </div>
        })


        return (
            <div>
                <Row style={{ textAlign: "center", fontSize: "120%", paddingTop: 15, paddingBottom: 15, }}>
                    <Col span={1}></Col>
                    <Col span={4} style={{ color: "#5a7af0", textAlign: "left" }} onClick={this.props.goBackToCategoriesHandler} >Cancel </Col>
                    <Col span={14} style={{ fontWeight: "bold" }}>New Category </Col>
                    <Col span={4} onClick={this.addNewCategoryHandler} style={{ color: "#5a7af0" }}> Save</Col>
                    <Col span={1}></Col>
                </Row>
                <hr />

                <Row style={{ textAlign: "center", fontSize: "120%", }}>
                    <Col span={1} ></Col>
                    <Col span={22} >
                        <Row >
                            <Col span={5} style={{ textAlign: "left", paddingTop: 15 }} >Name</Col>
                            <Col span={4} ></Col>
                            <Col span={15} >
                                <input style={textField}
                                    onChange={this.textFieldHandler}
                                    autoComplete="off"
                                    name="catagoryName"
                                    value={this.state.catagoryName}
                                    placeholder="Un named"
                                    className="change_AddCat" />
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                        <hr />
                        <Row >
                            <Col span={5} style={{ textAlign: "left", paddingTop: 15 }} >Type </Col>
                            <Col span={9} ></Col>
                            <Col span={10} style={{ paddingTop: 15, paddingBottom: 10 }} >
                                <div style={this.state.buttongroup}>
                                    <ButtonGroup style={{ textAlign: "right" }}>
                                        <Button style={this.state.expenseButtonStyles} onClick={this.expenseButtonHandler}>Expense</Button>
                                        <Button style={this.state.incomeButtonStyles} onClick={this.incomeButtonHandler}>Income</Button>
                                    </ButtonGroup>
                                </div></Col>
                        </Row>
                        <hr />

                        <Row>
                            <Col span={10} style={{ textAlign: "left", paddingTop: 10 }} >Icon</Col>
                            <Col span={9}></Col>
                            <Col span={5}> </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Slider
                                    initialSlide={2}
                                    {...settings}>
                                    <div style={{ display: "inline" }}>
                                        {set1}
                                    </div>
                                    <div>
                                        {set2}
                                    </div>
                                    <div>
                                        {set3}
                                    </div>
                                    <div>
                                        {set4}
                                    </div>
                                    <div>
                                        {set5}
                                    </div>
                                </Slider>

                            </Col>
                        </Row>

                    </Col>
                    <Col span={1} ></Col>
                </Row>
            </div>
        );
    }

}
export default (Add_categories);