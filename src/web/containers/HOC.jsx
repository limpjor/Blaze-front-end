import { compose } from 'redux';
import { connect } from 'react-redux';
import { callService as callServiceAction } from '../../service/callService';
import { setHandler as setHandlerAction } from '../../service/setHandlerAction';


const mapStateToProps = store => {
  return {
    order:store.management.order,
    listProductsOrder:store.management.products,
    alertShow:(store.management.alertShow)?store.management.alertShow:false,
    editOrder:(store.management.editOrder),
    newOrder:(store.management.newOrder)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    callService : (method, nameService, request) => dispatch(callServiceAction(method, nameService, request)),     
    setHandlerAction : (action,res) => dispatch(setHandlerAction( action,res))     
    

  }
}

const ComposedHOCRedux = compose(connect(mapStateToProps, mapDispatchToProps)); 


export default ComposedHOCRedux;
