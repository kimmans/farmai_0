#FarmAI - ai farm consulting app

#db structure

1. Consultants
    1. consultant_id
    2. email
    3. pwd
    4. full_name
    5. phone
    6. created_at
    7. updated_at
2. Farms
    1. farm_id
    2. name
    3. location
    4. ower_name
    5. size
    6. crop
    7. created_at
    8. updated_at
3. Consulting_Sessions 
    1.  consulting_id 
    2. farm_id(2-a)
    3. consultant_id(1-a)
    4. visit_date
    5. status ('diagnosis' | 'analysis' | 'solution')
    6. created_at
    7. updated_at
4. Environmental_Data
    1. id (PK)
    2. farm_id(2-a)
    3. consulting_id(3-a)
    4. temp_daytime
    5. temp_nighttime
    6. humidity
    7. co2_level
    8. light_intensity
    9. temp_outside (from API)
    10. whether(”sunny | cloudy | rain | snow”) (from API)
    11. recorded_at
    12. created_at   
5. Irrigation Data
    1. id (PK)
    2. farm_id(2-a)
    3. feed_ec
    4. feed_ph
    5. drain_ec
    6. drain_ph
    7. moisture_content
    8. feed_amount
    9. drain_amount
    10. recorded_at
    11. created_at   
6. Growth Management
    1. id (PK)
    2. farm_id(2-a)
    3. crop_image_url
    4. thinning_notes
    5. growth_stage
    6. recorded_at
    7. created_at   
7. Pest Management
    1. id (PK)
    2. farm_id(2-a)
    3. ispest
    4. pest_type
    5. pest_image_url
    6. severity
    7. treatment
    8. recorded_at
    9. created_at
8. Financial Management
    1. id(PK)
    2. consulting_id 
    3. electricity_cost
    4. labor_cost
    5. other_costs
    6. notes
    7. recorded_at
    8. created_at   
9. Owner Interviews 
    1. id(PK)
    2. consulting_id(1-a)
    3. concerns
    4. questions
    5. feedback
    6. recorded_at
    7. created_at
10. Consulting Reports
    1. id(PK)
    2. consulting_id(1-a)
    3. diagnosis
    4. ai_recommendations (jsonb)
    5. recorded_at
    6. created_at

