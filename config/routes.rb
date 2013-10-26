Project2::Application.routes.draw do
  root :to => "pages#home"
  get '/calendar', to: 'pages#calendar'
  get ':controller(/:action(/:id))(.:format)'
end
