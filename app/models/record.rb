class Record < ApplicationRecord
  has_many :record_completions # Cascade deletion on destroy!
end
