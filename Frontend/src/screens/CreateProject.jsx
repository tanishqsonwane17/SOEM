import axios from 'axios'
import React, { useEffect } from 'react'

const CreateProject = () => {
    useEffect(() => {
    
        axios.post('projects/create', {}).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })

    }, [])
    
  return (
    <>
    sadjbfjkdsf
    </>
  )
}

export default CreateProject