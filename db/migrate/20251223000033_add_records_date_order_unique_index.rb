class AddRecordsDateOrderUniqueIndex < ActiveRecord::Migration[8.0]
  def change
    add_index :records, %i[date order], unique: true
  end
end
