import { Result } from 'express-validator'
import * as aiService from '../services/ai.service.js'
export const getResult = async(req,res) =>{
    try{
        const {prompt} = req.query
        const result = await aiService.generateContent(prompt)
        res.send(result)
    }
    catch(err){
        return res.status(500).send({err:err.message})
    }
}