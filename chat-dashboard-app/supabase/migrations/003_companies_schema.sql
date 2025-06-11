-- Create companies table for Bekasi Kabupaten businesses
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT DEFAULT 'Bekasi Kabupaten',
  sub_district TEXT,
  village TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  business_type TEXT,
  description TEXT,
  established_year INTEGER,
  employee_count INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_district ON companies(district);
CREATE INDEX idx_companies_sub_district ON companies(sub_district);
CREATE INDEX idx_companies_business_type ON companies(business_type);
CREATE INDEX idx_companies_is_active ON companies(is_active);
CREATE INDEX idx_companies_created_at ON companies(created_at);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Anyone can view active companies" ON companies
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all companies" ON companies
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Users can update own companies" ON companies
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all companies" ON companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample companies data for Bekasi Kabupaten
INSERT INTO companies (name, address, sub_district, village, business_type, description, phone, email) VALUES
('PT Indofood Sukses Makmur', 'Jl. Raya Serang Km 29.5, Balaraja', 'Balaraja', 'Balaraja Timur', 'Manufaktur Makanan', 'Perusahaan manufaktur makanan dan minuman terbesar di Indonesia', '021-5960-9999', 'info@indofood.co.id'),
('PT Astra International', 'Jl. Gaya Motor Raya No. 8, Sunter II', 'Tanjung Priok', 'Sunter Agung', 'Otomotif', 'Perusahaan otomotif dan alat berat terkemuka di Indonesia', '021-6500-5555', 'corporate@astra.co.id'),
('PT Unilever Indonesia', 'Jl. BSD Boulevard Barat, Green Office Park', 'Serpong', 'Lengkong Gudang', 'Consumer Goods', 'Perusahaan barang konsumen multinasional', '021-5395-8000', 'contact@unilever.co.id'),
('CV Berkah Jaya Mandiri', 'Jl. Raya Bekasi Km 25, Cibitung', 'Cibitung', 'Wanasari', 'Perdagangan', 'Distributor alat-alat elektronik dan komputer', '021-8832-1234', 'info@berkahjaya.co.id'),
('PT Mitra Usaha Sejahtera', 'Jl. Industri Raya No. 15, Cikarang', 'Cikarang Barat', 'Telaga Asih', 'Tekstil', 'Pabrik tekstil dan garmen untuk ekspor', '021-8990-5678', 'export@mitrausaha.co.id'),
('UD Sumber Rezeki', 'Jl. Pasar Baru No. 45, Tambun', 'Tambun Selatan', 'Setia Asih', 'Perdagangan', 'Toko grosir bahan bangunan dan material konstruksi', '021-8821-9876', 'sumberrezeki@gmail.com'),
('PT Karya Mandiri Sejati', 'Jl. Raya Narogong Km 12, Bantargebang', 'Bantargebang', 'Bantargebang', 'Konstruksi', 'Kontraktor bangunan dan infrastruktur', '021-8459-3210', 'karya@mandiri-sejati.co.id'),
('CV Harapan Bersama', 'Jl. Kalimalang No. 88, Bekasi Timur', 'Bekasi Timur', 'Aren Jaya', 'Jasa', 'Jasa logistik dan pengiriman barang', '021-8800-4567', 'harapan@bersama.co.id'),
('PT Teknologi Nusantara', 'Jl. Raya Cibitung Km 3, Cibitung', 'Cibitung', 'Sukadanau', 'Teknologi', 'Perusahaan software dan IT solutions', '021-8832-7890', 'info@teknologi-nusantara.co.id'),
('UD Makmur Sejahtera', 'Jl. Raya Tambun No. 67, Tambun', 'Tambun Utara', 'Margamulya', 'Pertanian', 'Distributor pupuk dan alat pertanian', '021-8821-5432', 'makmur@sejahtera.co.id'),
('PT Cahaya Abadi Sentosa', 'Jl. Industri Cikarang No. 25, Cikarang', 'Cikarang Utara', 'Kalijaya', 'Manufaktur', 'Pabrik komponen elektronik dan spare parts', '021-8990-1357', 'cahaya@abadi.co.id'),
('CV Maju Bersama Jaya', 'Jl. Raya Bekasi-Cikampek Km 18', 'Muaragembong', 'Pantai Bahagia', 'Perikanan', 'Budidaya ikan dan udang untuk ekspor', '021-8834-2468', 'maju@bersama.co.id'),
('PT Sinar Harapan Utama', 'Jl. Raya Serang Km 35, Rajeg', 'Rajeg', 'Rajeg', 'Logistik', 'Perusahaan ekspedisi dan warehouse', '021-5962-8024', 'sinar@harapan.co.id'),
('UD Berkah Mandiri', 'Jl. Pasar Cibarusah No. 12', 'Cibarusah', 'Cibarusah Kota', 'Perdagangan', 'Toko kelontong dan kebutuhan sehari-hari', '021-8825-9753', 'berkah@mandiri.co.id'),
('PT Wijaya Karya Beton', 'Jl. Raya Cileungsi Km 8, Cileungsi', 'Cileungsi', 'Cileungsi', 'Konstruksi', 'Pabrik beton precast dan ready mix', '021-8230-4681', 'wijaya@karya.co.id');

-- Create view for company statistics
CREATE VIEW company_stats AS
SELECT 
  COUNT(*) as total_companies,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_companies,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_companies,
  COUNT(DISTINCT business_type) as business_types,
  COUNT(DISTINCT sub_district) as sub_districts
FROM companies;

