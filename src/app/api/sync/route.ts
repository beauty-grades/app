import { NextResponse } from 'next/server'
import {z} from 'zod'


import { getXataClient } from '@/lib/xata/codegen'
const xata = getXataClient()


const schema = z.object({
  email: z.string().email(),
  tokenV1: z.string(),
  tokenV2: z.string(),
})

export const OPTIONS = () => NextResponse.json({}, {status: 200, headers: {
  'Access-Control-Allow-Origin': "https://sistema-academico.utec.edu.pe",
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}})



export const POST = async (req: Request) => {
  try {
    let body = await req.json();

    let {email, tokenV1, tokenV2} = schema.parse(body)

    let metadata = await xata.db.metadata.filter({email}).getFirst()

    if (!!metadata) {
      metadata = await xata.db.metadata.update(metadata.id, {
       tokenV1,
         tokenV2,
      })
    } else {
      metadata = await xata.db.metadata.create({
        email,
        tokenV1,
        tokenV2,
      })
    }


    let name = email.split('.')[0]
    let formatted_name = name.charAt(0).toUpperCase() + name.slice(1)

    return NextResponse.json({
      message: `Hey ${formatted_name}! We started feeding your information. Please wait a few minutes`
    },{
      status: 200
    })
  }

  catch (error) {
    console.log(error)
    return NextResponse.json({
      message: error.message
    },{
      status: 500
    })
  }
}