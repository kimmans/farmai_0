-- FarmAI Supabase Database Schema
-- 농장 컨설팅 시스템을 위한 테이블 생성 SQL

-- 1. 컨설턴트 테이블
CREATE TABLE consultants (
    consultant_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 농장 테이블
CREATE TABLE farms (
    farm_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(500) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    size DECIMAL(10,2), -- 농장 크기 (평방미터)
    crop VARCHAR(100), -- 재배 작물
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 컨설팅 세션 테이블
CREATE TABLE consulting_sessions (
    consulting_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farm_id UUID REFERENCES farms(farm_id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES consultants(consultant_id) ON DELETE SET NULL,
    visit_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('diagnosis', 'analysis', 'solution')) DEFAULT 'diagnosis',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 환경 데이터 테이블
CREATE TABLE environmental_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farm_id UUID REFERENCES farms(farm_id) ON DELETE CASCADE,
    consulting_id UUID REFERENCES consulting_sessions(consulting_id) ON DELETE CASCADE,
    temp_daytime DECIMAL(5,2), -- 주간 온도
    temp_nighttime DECIMAL(5,2), -- 야간 온도
    humidity DECIMAL(5,2), -- 습도 (%)
    co2_level DECIMAL(8,2), -- CO2 농도 (ppm)
    light_intensity DECIMAL(10,2), -- 조도 (lux)
    temp_outside DECIMAL(5,2), -- 외부 온도 (API에서 가져온 데이터)
    weather VARCHAR(20) CHECK (weather IN ('sunny', 'cloudy', 'rain', 'snow')), -- 날씨
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 관수 데이터 테이블
CREATE TABLE irrigation_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farm_id UUID REFERENCES farms(farm_id) ON DELETE CASCADE,
    feed_ec DECIMAL(4,2), -- 공급액 EC (mS/cm)
    feed_ph DECIMAL(3,1), -- 공급액 pH
    drain_ec DECIMAL(4,2), -- 배액 EC (mS/cm)
    drain_ph DECIMAL(3,1), -- 배액 pH
    moisture_content DECIMAL(5,2), -- 토양 수분 함량 (%)
    feed_amount DECIMAL(8,2), -- 공급량 (L)
    drain_amount DECIMAL(8,2), -- 배액량 (L)
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 생육 관리 테이블
CREATE TABLE growth_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farm_id UUID REFERENCES farms(farm_id) ON DELETE CASCADE,
    crop_image_url TEXT, -- 작물 이미지 URL
    thinning_notes TEXT, -- 솎음 작업 노트
    growth_stage VARCHAR(50), -- 생육 단계
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 병해충 관리 테이블
CREATE TABLE pest_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farm_id UUID REFERENCES farms(farm_id) ON DELETE CASCADE,
    ispest BOOLEAN DEFAULT FALSE, -- 병해충 발생 여부
    pest_type VARCHAR(100), -- 병해충 종류
    pest_image_url TEXT, -- 병해충 이미지 URL
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')), -- 심각도
    treatment TEXT, -- 방제 방법
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 경영 관리 테이블
CREATE TABLE financial_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consulting_id UUID REFERENCES consulting_sessions(consulting_id) ON DELETE CASCADE,
    electricity_cost DECIMAL(12,2), -- 전기비
    labor_cost DECIMAL(12,2), -- 인건비
    other_costs DECIMAL(12,2), -- 기타 비용
    notes TEXT, -- 비고
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 농장주 인터뷰 테이블
CREATE TABLE owner_interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consulting_id UUID REFERENCES consulting_sessions(consulting_id) ON DELETE CASCADE,
    concerns TEXT, -- 우려사항
    questions TEXT, -- 질문
    feedback TEXT, -- 피드백
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 컨설팅 리포트 테이블
CREATE TABLE consulting_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consulting_id UUID REFERENCES consulting_sessions(consulting_id) ON DELETE CASCADE,
    diagnosis TEXT, -- 진단 내용
    ai_recommendations JSONB, -- AI 추천사항 (JSON 형태로 저장)
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_farms_owner_name ON farms(owner_name);
CREATE INDEX idx_consulting_sessions_farm_id ON consulting_sessions(farm_id);
CREATE INDEX idx_consulting_sessions_status ON consulting_sessions(status);
CREATE INDEX idx_environmental_data_farm_id ON environmental_data(farm_id);
CREATE INDEX idx_environmental_data_recorded_at ON environmental_data(recorded_at);
CREATE INDEX idx_irrigation_data_farm_id ON irrigation_data(farm_id);
CREATE INDEX idx_growth_management_farm_id ON growth_management(farm_id);
CREATE INDEX idx_pest_management_farm_id ON pest_management(farm_id);
CREATE INDEX idx_financial_management_consulting_id ON financial_management(consulting_id);
CREATE INDEX idx_owner_interviews_consulting_id ON owner_interviews(consulting_id);
CREATE INDEX idx_consulting_reports_consulting_id ON consulting_reports(consulting_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE irrigation_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_reports ENABLE ROW LEVEL SECURITY;

-- updated_at 자동 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_consultants_updated_at BEFORE UPDATE ON consultants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consulting_sessions_updated_at BEFORE UPDATE ON consulting_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입 (테스트용)
INSERT INTO consultants (email, pwd, full_name, phone) VALUES
('consultant1@farmai.com', 'hashed_password_1', '김컨설턴트', '010-1234-5678'),
('consultant2@farmai.com', 'hashed_password_2', '이컨설턴트', '010-2345-6789');

INSERT INTO farms (name, location, owner_name, size, crop) VALUES
('스마트팜 A', '경기도 수원시', '박농장주', 1000.00, '딸기'),
('스마트팜 B', '충청남도 천안시', '김농장주', 800.00, '토마토'),
('스마트팜 C', '전라북도 전주시', '이농장주', 1200.00, '오이'); 