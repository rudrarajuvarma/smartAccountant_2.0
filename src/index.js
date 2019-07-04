import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Signin from './components/Signin';
import Home from './components/Home';
import Add_details from './components/Add_details';
import Add_account from './components/Add_account';
import Add_categories from './components/Add_categories';
import Show_categories from './components/Show_categories';
import { HashRouter, Route, Switch } from 'react-router-dom';

class App extends Component {

    render() {
        return (
            <HashRouter>
                <Switch> 
                 {(localStorage.getItem('signed_in_v2')=="true")?
                 <Route exact path="/" component={Home} />
                 :
                 <Route exact path="/" component={Signin} />
                 }
                <Route path="/Signin" component={Signin}/>
                <Route path="/Home" component={Home}  />
                <Route path="/Add_details" component={Add_details}/>
                <Route path="/Add_account" component={Add_account}/>
                <Route path="/Add_categories" component={Add_categories}/>
                <Route path="/Show_categories" component={Show_categories}/>
                </Switch>
            </HashRouter>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


