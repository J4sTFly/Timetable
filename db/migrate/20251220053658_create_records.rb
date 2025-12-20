class CreateRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :records do |t|
      t.string :name
      t.integer :order, null: false
      t.date :date, default: Date.new(Date.today.year, Date.today.month, 1)
      t.timestamps

      t.index :date
    end
  end
end
