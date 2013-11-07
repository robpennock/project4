class AppointmentController < ApplicationController	
	def index			#7 methods from ruby documentation on routes #boiler plate stuff
		if  params.key?(:month) && params.key?(:year)
				@appointments = Appointment.where(:month => params[:month]).where(:year => params[:year])
		else
			#@appointments.all
		end
		render json: @appointments
	end
	def new
	end
	def create
		appointment = Appointment.create(
			month: params[:month],
			day: params[:day],
      		year: params[:year],
      		desc: params[:desc],
      		time: params[:time]
      		)
		appointment.save
	end
	def show
	end
	def edit
	end
	def update
	end
	def destroy
	end
end
