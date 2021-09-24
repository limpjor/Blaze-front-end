import axios from 'axios';
import {CONSTANT} from '../utils/constant'

export const callService = (method,nameService,request) => async dispatch =>{
    try{
        let response = '';
        let data = {
            body:request,
            response: true,
            headers:{
            }
        }

        if (method){
            if("POST"=== method.toUpperCase())
           // response =  await axios.post(CONSTANT.PATH+nameService,request)
                response =  await axios.post(CONSTANT.PATH+nameService,request)
            if("GET"=== method.toUpperCase())
                response =  await axios.get(CONSTANT.PATH+nameService,data)
            
            if("PUT"=== method.toUpperCase() )
                response =  await axios.put(CONSTANT.PATH+nameService,data)
            
            if("DELETE"=== method.toUpperCase() )
                response =  await axios.delete(CONSTANT.PATH+nameService,data)              
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}