import React, { Component } from 'react'
import {Link} from 'react-router'
import { connect } from 'react-redux'
import Item from './ListItem'


export default class List extends Component {
    componentDidMount(){
        this.props.actions.getList(this.getUrl(this.props.city,this.props.params.category));
    }
    componentWillReceiveProps(nextProps) {
        if(this.needReload(nextProps)){
            this.props.actions.getList(this.getUrl(nextProps.city, nextProps.params.category));
        }
    }
    needReload(nextProps){
        return(
                nextProps.params.category != this.props.params.category ||
                nextProps.city != this.props.city
        )
    }
    getUrl(city, menu_item){
        let url;
        switch(menu_item){
            case 'my'   : url = "";break;
            case 'new'  : url = ['c?url='+city+'/collection/restaurants/all/&pos={%22lat%22:55.748747599999994,%22lng%22:37.5629053}&filter={%22New%22:%221%22}',
                                'c?url='+city+'/collection/clubs&pos={%22lat%22:55.748747599999994,%22lng%22:37.5629053}&filter={%22New%22:%221%22}'];break;
            case 'terrace'  : url = ['c?url='+city+'/collection/restaurants/all/&pos={%22lat%22:55.748747599999994,%22lng%22:37.5629053}&filter={%22icon%22:%22573ae9e83f1806063cd6359c%22}',
                                    'c?url='+city+'/collection/clubs&pos={%22lat%22:55.748747599999994,%22lng%22:37.5629053}&filter={%22icon%22:%22573ae9e83f1806063cd6359c%22}'];break;
            case 'bars'  : url = ['c?url='+city+'/collection/clubs/&pos={%22lat%22:55.748747599999994,%22lng%22:37.5629053}&filter={%22type%22:%22bars%22}',
                                'c?url='+city+'/collection/clubs/&pos={%22lat%22:55.748747599999994,%22lng%22:37.5629053}&filter={%22type%22:%22clubs%22}'];break;
            default : url = ""
        }
        return url
    }
    render() {
        const {items, icons, error } = this.props;
        const m = ($(window).height()/3)+"px"

        return (
                <div className="event_collection">
                    {error ? (error == 'wait' ? <center style={{marginTop:m}}><img src='/img/loading2.gif' /></center> :
                        <span style={{fontSize:'10px',color:'red'}}>{error}</span>)
                            : this.props.items.map((item, i)=>{ return <Item key={i} item={item} icons={icons}/> } )}
                    <div className="clear"></div>
                </div>
                )
    }
}
function mapStateToProps (state) {
    return {
        items : state.listItems,
        icons : state.icons,
        error : state.error
    }
}


export default connect(mapStateToProps)(List)