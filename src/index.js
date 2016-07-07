import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRedirect , browserHistory } from 'react-router'

import Main from './Main'
import Item from './Item'

import configureStore from './configureStore'

import './static/css/style.css'

import './static/js/jquery.customSelect.min.js'
import './static/js/jquery.raty.js'
//import './static/js/slideout.js'
import './static/js/readmore.min.js'
//import './static/js/scripts.js'

const store = configureStore()

render(
    <Provider store={store}>
        <Router history={browserHistory}>
                <Route path='/' component={Main} >
                    <IndexRedirect to='/new' />
                    <Route path=':category' component={Main} />
                </Route>
                <Route path='/:category/:item' component={Item} />
                <Route path='/:category/:subcategory/:item' component={Item} />
        </Router>
    </Provider>,
    document.getElementById('root')
)
