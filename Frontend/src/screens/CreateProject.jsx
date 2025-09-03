import axios from 'axios'
import React, { useEffect } from 'react'

const CreateProject = () => {
    useEffect(() => {
    
        axios.post('https://soen-1-r9s4.onrender.com/projects/create', {}).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })

    }, [])
    
  return (
    <>
    
    </>
  )
}

export default CreateProject