-- FarmAI RLS (Row Level Security) Policies
-- 테이블 접근 권한 설정

-- 1. 컨설턴트 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON consultants
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON consultants
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on consultant_id" ON consultants
    FOR UPDATE USING (auth.uid()::text = consultant_id::text);

-- 2. 농장 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON farms
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON farms
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON farms
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON farms
    FOR DELETE USING (auth.role() = 'authenticated');

-- 3. 컨설팅 세션 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON consulting_sessions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON consulting_sessions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON consulting_sessions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. 환경 데이터 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON environmental_data
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON environmental_data
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON environmental_data
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. 관수 데이터 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON irrigation_data
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON irrigation_data
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON irrigation_data
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 6. 생육 관리 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON growth_management
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON growth_management
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON growth_management
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 7. 병해충 관리 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON pest_management
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON pest_management
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON pest_management
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 8. 경영 관리 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON financial_management
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON financial_management
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON financial_management
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 9. 농장주 인터뷰 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON owner_interviews
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON owner_interviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON owner_interviews
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 10. 컨설팅 리포트 테이블 RLS 정책
CREATE POLICY "Enable read access for all users" ON consulting_reports
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON consulting_reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON consulting_reports
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 또는 더 간단하게 모든 테이블에 대해 RLS를 비활성화하려면:
-- ALTER TABLE farms DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE consultants DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE consulting_sessions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE environmental_data DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE irrigation_data DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE growth_management DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE pest_management DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE financial_management DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE owner_interviews DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE consulting_reports DISABLE ROW LEVEL SECURITY; 