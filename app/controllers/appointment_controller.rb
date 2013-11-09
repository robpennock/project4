class AppointmentController < ApplicationController

	def index	#GET on /appointment
		if params.key?(:the_month) && params.key?(:the_year)
			appts = Appointment.where(:the_month => params[:the_month]).where(:the_year => params[:the_year])
		else
			#@appointments = Appointment.all	
		end
		render json: appts
	end

	def create #POST to /appointment
		appt = Appointment.create(
			the_month: params[:the_month],
			the_day: params[:the_day],
			the_year: params[:the_year],
			the_desc: params[:the_desc],
			the_time: params[:the_time]
		)	
		redirect_to 'create' => 'calendar'	#will not work without redirect
	end

end
