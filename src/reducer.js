const initialState = {
    filters : [
        {title : 'МОЙ',link : 'my'},
        {title : 'NEW',link : 'new'},
        {title : 'ВЕРАНДЫ',link : 'terrace'},
        {title : 'БАРЫ И КЛУБЫ',link : 'bars'},
        {title : 'КАФЕ',link : 'cafe'},
        {title : 'ПОПЛУРЯНЫЕ',link : 'popular'}
    ],
    listItems : [],
    icons : {
        "563373b2e86d1a18d345e5fa" : "badge_rest_mony2","56337414e86d1a18d345e606":"badge_rest_mony3",
        "5633742ae86d1a18d345e608" : "badge_rest_wine","56337438e86d1a18d345e60c" : "badge_rest_view",
        "56337450e86d1a18d345e60e":"badge_rest_music","5633745be86d1a18d345e610":"badge_rest_breakfast",
        "56337481e86d1a18d345e615": "badge_rest_kids","5633748ce86d1a18d345e617":"badge_rest_hookah",
        "5633746ee86d1a18d345e613":"badge_rest_private","573ae9e83f1806063cd6359c":"badge_rest_terrace"
    },
    error : 'wait',
    center : {lat : 0, lng : 0},
    city : 'msk',
    update : false,
    cuisines : [],
    categoryItem : null
}

export default function reducer(state = initialState, action) {
    let c
    switch (action.type) {
        case 'GET_LIST':
            return { ...state, error : 'wait',update : false }
        case 'GET_LIST_SUCCESS':
                c = action.payload.center
                return { ...state, update : true,listItems: action.payload.items, center : {lat : c.lat/c.c, lng : c.lng/ c.c}, error : false}
        case 'GET_LIST_ERROR':
            return { ...state, error :  action.payload, update : false}
        case 'CITY_CHANGED':
            return { ...state, update : false, city : action.payload}
        case 'GET_CUISINES':
            return { ...state, update : false, cuisines : action.payload}
        case 'GET_ITEM':
            return { ...state, error : 'wait'}
        case 'GET_ITEM_SUCCESS':
            return { ...state, error : false, categoryItem : action.payload}
        case 'GET_ITEM_ERROR':
            return { ...state, error :  action.payload}
        default :
            return state;
    }
}
