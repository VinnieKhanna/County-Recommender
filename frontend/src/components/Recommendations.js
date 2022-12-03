import React, { useEffect } from 'react'
export default function Recommendations(props) {
    useEffect(() => {
        // Can't use props.token here since it may not have loaded yet
        // Need synchronous check to local/session
        let local = localStorage.getItem("flask-jwt-token");
        let session = sessionStorage.getItem("flask-jwt-token");
        let token = local ? local : session;
        fetch("/get_recommendations", {
            method: "GET",
            headers: {
                "Authorization" : `JWT ${token}`
            }
        }).then(res => {
            console.log(res)
        })
    }, [])
    return (
        <>
            <h1>
                County Recommendations Page
            </h1>
        </>
    )
}