import _ from "lodash";

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}
export function shortenNumber(amount: number) {
    let t = { fractionAmount: Number.MAX_VALUE, abbrev: "" }
    const g = [{ abbrev: "T", value: 1000000000000 }, { abbrev: "B", value: 1000000000 }, { abbrev: "M", value: 1000000 }, { abbrev: "K", value: 1000 }]
    if (!isNaN(amount)) {
        const length = String(amount).length
        t = g.reduce((prev, curr) => {
            // debugger
            const fractionAmount = amount / curr.value
            const sp = String(fractionAmount).split(".")
            if (String(sp[0]).length <= 3) {


                return { ...curr, fractionAmount }
            }
            return prev
        }, { fractionAmount: Number.MAX_VALUE, abbrev: "" })

    }
    return t
}

export function isEmptyObject<T>(obj: Record<keyof T, string | boolean >[]) {
    return _.flow(_.values, _.compact, _.isEmpty)(obj)
}

export function validateUppercase(str:string) {
  return  /[A-Z]/.test(str)
}

export function validateLowercase(str:string) {
    return /[a-z]/.test(str)
}

export function validateNumber(str:string) {
    return /[0-9]/.test(str)
}

export function validateEmail(email:string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function comparePassword(pass1: string, pass2:string) {
    return pass1 === pass2
}

export function validateexColor(color:string) {
   return  /^#[0-9A-F]{6}$/i.test(color) || /^#([0-9A-F]{3}){1,2}$/i.test(color)
}

export function APICatch(error:any, res:any) {
    // debugger
    if (typeof error.data !== "undefined") {
        if (typeof error.data.error_description !== "undefined") {
            error.message = error.data.error_description
        } else {
            error.message = error.data.message
        }
        return res.status(error.response.status).json(error)
    }
    return res.status(400).json(error)
}

export async function fetchJson<T extends Record<keyof T, K>, K> (input: RequestInfo, init?: RequestInit):Promise<T> {  
        try {
            // console.log({init});
            // debugger
            const response = await fetch(input, init);
            const data = await response.json()
            // debugger
            if(response.ok) {
                return data as T;
            }
            else if(typeof data !== "undefined") {

              return data
            }
            else { throw {
                response
              };
            
            }
    
        } catch (error:any) {
            console.error({fetchJsonError: error})
            // debugger
            if(typeof error.data !== "undefined") {
                error = error.data
            }
            return error;
        }
    
}