import {Component } from 'react';
import HOC from '../containers/HOC';
import ListProducts from '../components/product/ListProducts';

class Products extends Component {
    
    render(){    
         return(
             <div>
                <ListProducts {...this.props}/>
                    
            </div>
        )
    }
}
export default HOC(Products);
