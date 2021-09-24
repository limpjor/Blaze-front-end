import { handleActions } from 'redux-actions';
import { ORDER, PRODUCTS, ALERT,EDITORDERS,NEWORDER } from '../actions';

export default  handleActions(
    {
        [ORDER]: (state, action) => {
            return Object.assign({}, state,{order:action.payload} );
        },
        [PRODUCTS]: (state, action) => {        
            return Object.assign({}, state,{products:action.payload} );
        },
        [ALERT]: (state, action) => {      
            return Object.assign({}, state,{alertShow:action.payload} );
        },
        [EDITORDERS]:(state, action) => {      
            return Object.assign({}, state,{editOrder:action.payload} );
        },
        [NEWORDER]:(state, action) => {      
            return Object.assign({}, state,{newOrder:action.payload} );
        },
    },
    {}
  );