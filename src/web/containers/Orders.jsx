import {Component } from 'react';
import HOC from '../containers/HOC';
import ListOrders from '../components/orders/ListOrders';
import EditOrders from '../components/orders/EditOrders';

class Orders extends Component {
    
    render(){    
         return(
             <div>
                {(this.props.editOrder)?
                    <EditOrders {...this.props}/>
                    :
                    <ListOrders {...this.props}/>
                }
            </div>
        )
    }
}
export default HOC(Orders);
