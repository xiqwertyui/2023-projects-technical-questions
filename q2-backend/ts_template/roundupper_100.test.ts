import request from 'sync-request';
import {HOST, PORT} from './config.json'

const OK = 200;
const SuccessfulResponses = {
  lower: 200,
  upper: 299
};

const root = `${HOST}:${PORT}`;

const advanceRequest = (method : ('GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'), route : string, parameters : object) => {
  const res = request(
    method,
    root + route,
    (method === 'GET' || method === 'DELETE') ? { qs: parameters } : { json: parameters }
  );
  return JSON.parse(res.getBody() as string);
};


function clear() {
  return advanceRequest("DELETE", "/clear", {});
}


beforeEach(()=>clear());

describe('/entity',()=>{
  const entity = {
    "entities": [
        {
            "type": "space_cowboy",
            "metadata": {
                "name": "Jim",
                "lassoLength": 1 
            },
            "location": {
                "x": 0,
                "y": 0
            }
        },
        {
            "type": "space_cowboy",
            "metadata": {
                "name": "Bob",
                "lassoLength": 2 
            },
            "location": {
                "x": 0,
                "y": 0
            }
        },
        {
            "type": "space_animal",
            "metadata": {
                "type": "flying_burger"
            },
            "location": {
                "x": 1,
                "y": 1
            }
        },
        {
          "type": "space_animal",
          "metadata": {
              "type": "pig"
          },
          "location": {
              "x": 0,
              "y": 2
          }
        },
        {
          "type": "space_animal",
          "metadata": {
              "type": "dragon"
          },
          "location": {
              "x": 0,
              "y": 3
          }
        },
    ]
  }
  const query  = {
    "cowboy_name": "Bob" 
  }
  test('/entity',()=>{
   
    expect(advanceRequest("POST", '/entity', entity)).toStrictEqual({});
    
  })

  test ('/la', ()=>{
    expect(advanceRequest("POST", '/entity', entity)).toStrictEqual({});
    expect(advanceRequest("GET", '/lassoable', query).space_animals).toStrictEqual(
      expect.arrayContaining([
        {
            "type": "pig",
            "location": {
                "x": 0,
                "y": 2
            } 
        },
        {
            "type": "flying_burger",
            "location": {
                "x": 1,
                "y": 1
            } 
        }
    ]))
  })
})

