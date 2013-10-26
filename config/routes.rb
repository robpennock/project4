Project2::Application.routes.draw do
  root :to => "pages#home"
  get ':controller(/:action(/:id))(.:format)'
end
