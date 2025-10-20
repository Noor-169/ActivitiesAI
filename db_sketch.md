# Users

id
name
email
password
(future: style/color formatting? or based on IP?)

user -> activities = one to many
user - tags = one to many

# Activities

id
name
description
duration
difficulty
type
materials needed?

activities -> users = belongs to
activities - tags = many to many

# Tags

id
name

tags - users = many to many
tags - activities = many to many

#

Every user gets HHH tags assigned to them at the start
