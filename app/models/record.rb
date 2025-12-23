class Record < ApplicationRecord
  has_many :record_completions # Cascade deletion on destroy!

  validates_presence_of :name, :order, :date
  validates :order, uniqueness: { scope: :date }
end
