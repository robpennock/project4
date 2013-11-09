class CreateAppointments < ActiveRecord::Migration
  def change  
    create_table :appointments do |t|
      t.integer :the_month
      t.integer :the_day
      t.integer :the_year
      t.string :the_desc
      t.string :the_time

      t.timestamps
    end
  end
end
