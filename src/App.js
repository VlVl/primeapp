import React from 'react'
import Menu from './Menu'

export default class App extends React.Component {
    constructor(props){
        super(props)
        this.toggleMenu = this.toggleMenu.bind(this)
    }
    getChildContext(){
        return { toggleMenu : this.toggleMenu};
    }
    slideout : null
    componentDidMount(){
        this.slideout = new Slideout({
            'panel': document.getElementById('main_container'),
            'menu': document.getElementById('main_menu'),
            'padding': $(window).width(),
            'tolerance': 50,
            'side': 'right'
        })
        this.slideout.disableTouch();
    }
    toggleMenu(){
        this.slideout.toggle()
    }
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
App.childContextTypes = {
    toggleMenu  : React.PropTypes.func.isRequired
}