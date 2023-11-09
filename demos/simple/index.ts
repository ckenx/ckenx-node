import type { Kenx } from '#types/service'
import type http from 'http'
import type io from 'socket.io'
import routes from './routes'

export const takeover = ['http', 'socketio', 'database:*']
export default ( http: Kenx.ServerPlugin<http.Server>, io: io.Server, databases: { [index: string]: Kenx.DatabasePlugin<any> } ) => {
  if( !http ) return
  
  const { app } = http
  if( !app ) return

  app
  // Decorate application with socket.io server interface
  .decorate('io', io )
  // Decorate application with default database
  .decorate('mongodb', databases.default.getConnection() )

  // Add express middleware
  .addHandler('middleware', ( req: any, res: any, next: any ) => {
    console.log('-- Middleware --')

    // Test session
    req.session.name = 'Bob'
    
    next()
  })

  // Register express routes
  .addRouter('/', routes )

  // Handle application exception errors
  .onError( ( error: Error, req, res, next ) => {
    console.log( error )
    res.status(500).send( error )
  })
}