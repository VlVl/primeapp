import axios from 'axios';

export function setCity(str){
    return {
        type : 'CITY_CHANGED',
        payload : str
    }
}
export function getCuisines(str){
    return dispatch => {
        axios.get('/request/c?url=' + str + '/_filter')
            .then(resp =>
                {
                    dispatch({
                        type : 'GET_CUISINES',
                        payload : resp.data.cuisines
                    })
                }, err =>
                {
                    dispatch({
                        type : 'GET_CUISINES_ERROR',
                        payload : JSON.stringify(err)
                    })
                }
        )
    }
}
export function getList(urls) {
    if(!Array.isArray(urls)) urls = [urls];
    return (dispatch) => {
        dispatch({
            type: "GET_LIST",
            payload : false
        })
        axios.all(urls.map((url)=>{return axios.get('/request/' + url)}))
            .then(datas =>
                {
                    let result = [], errors = [], center = {c : 0, lat : 0, lng : 0}
                    datas.forEach(data =>{
                        let resp = data.data
                        if(!resp.error){
                            if(resp.data) resp.data.pop()
                            result = result.concat(resp.data || resp)
                            center.c += resp.center.c
                            center.lat += resp.center.lat
                            center.lng += resp.center.lng
                        }else{
                            errors.push(resp.error)
                        }
                    })
                    if(errors.length === 0){
                        dispatch({
                            type: "GET_LIST_SUCCESS",
                            payload: {items : result, center : center }
                        })
                    }else{
                        dispatch({
                            type: "GET_LIST_ERROR",
                            payload: errors.join()
                        })
                    }
                },(errs)=>
                {
                    dispatch({
                        type: "GET_LIST_ERROR",
                        payload : JSON.stringify(errs)
                    })
                })
    }
}
export function getItem(url) {
    return (dispatch) => {
        dispatch({
            type: "GET_ITEM",
            payload : false
        })
        axios.get('/request/' + url)
            .then(function (response) {
                let item = response.data.data;
                item.inner_link = "/"
                dispatch({
                    type: "GET_ITEM_SUCCESS",
                    payload: item
                })
            })
            .catch(function (response) {
                dispatch({
                    type: "GET_ITEM_ERROR",
                    payload : response.message
                })
            });
    }
}