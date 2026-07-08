
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  block_key text NOT NULL,
  label text NOT NULL,
  kind text NOT NULL DEFAULT 'text', -- text | textarea | html
  content text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_key, block_key)
);

GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read enabled site content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage site content"
  ON public.site_content FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

CREATE INDEX site_content_page_idx ON public.site_content (page_key, sort_order);

-- ========= SEED CONTENT =========
INSERT INTO public.site_content (page_key, block_key, label, kind, content, sort_order) VALUES
-- ============ GLOBAL: HEADER ============
('header','tagline','Header · Phone label (24/7 Dispatch)','text','24/7 Dispatch',10),
('header','services_label','Header · Services menu label','text','Services',20),
('header','about_label','Header · About menu label','text','About',30),
('header','blog_label','Header · Blog link label','text','News & Guides',40),
('header','cta_label','Header · CTA button label','text','Get Quote',50),
('header','featured_service_badge','Header · Featured service badge','text','New',60),
('header','featured_service_title','Header · Featured service title','text','Tractor Shipping Services',70),
('header','featured_service_desc','Header · Featured service description','text','Compact, row-crop, 4WD & high-HP tractors nationwide',80),

-- ============ GLOBAL: FOOTER ============
('footer','description','Footer · Description paragraph','textarea','Nationwide heavy haul, oversize load, and equipment transport, built on safety, speed, and straight talk.',10),
('footer','call_label','Footer · Phone label (Call 24/7)','text','Call 24/7',20),
('footer','services_heading','Footer · Services column heading','text','Services',30),
('footer','company_heading','Footer · Company column heading','text','Company',40),
('footer','resources_heading','Footer · Resources column heading','text','Resources',50),
('footer','tagline','Footer · Right-side tagline','text','heavyhaulgroup.com · Nationwide Service',60),

-- ============ HOME: HERO ============
('home','hero_badge_1','Hero · Top badge #1','text','#1 Rated Heavy Haul Carrier Network',10),
('home','hero_badge_2','Hero · Top badge #2','text','12 Dispatchers Online Now',20),
('home','hero_title_line1','Hero · Title line 1','text','Heavy Haul &',30),
('home','hero_title_line2','Hero · Title line 2 (accent)','text','Oversize Load',40),
('home','hero_title_line3','Hero · Title line 3','text','Transport Nationwide',50),
('home','hero_subtitle','Hero · Subtitle paragraph','textarea','Quality heavy load transport, anytime, anywhere across the United States. Same-day quotes. Fully insured. DOT compliant.',60),
('home','hero_phone_label','Hero · Phone label','text','Speak To A Dispatcher',70),
('home','hero_cta_label','Hero · Primary CTA button','text','Get Free Quote',80),
('home','hero_trust_1','Hero · Trust badge #1','text','Fully Insured',90),
('home','hero_trust_2','Hero · Trust badge #2','text','DOT Compliant',100),
('home','hero_trust_3','Hero · Trust badge #3','text','Expert Drivers',110),
('home','hero_trust_4','Hero · Trust badge #4','text','All 50 States',120),

-- ============ HOME: STATS BAR ============
('home','stat_1_label','Stats · #1 label','text','Avg. Rating',130),
('home','stat_1_sub','Stats · #1 sub','text','2,400+ shippers',131),
('home','stat_2_label','Stats · #2 label','text','Years',140),
('home','stat_2_sub','Stats · #2 sub','text','In heavy haul',141),
('home','stat_3_label','Stats · #3 label','text','Loads',150),
('home','stat_3_sub','Stats · #3 sub','text','Delivered safely',151),
('home','stat_4_label','Stats · #4 label','text','States',160),
('home','stat_4_sub','Stats · #4 sub','text','Nationwide coverage',161),

-- ============ HOME: SERVICES SECTION ============
('home','services_eyebrow','Services · Eyebrow','text','What We Haul',200),
('home','services_title_1','Services · Title','text','Specialized Transport',210),
('home','services_title_2','Services · Title accent','text','For Every Industry',220),
('home','services_subtitle','Services · Subtitle','textarea','From farm equipment to industrial machinery, click any category for full sub-services, brand specialties, and shipping rates.',230),

-- ============ HOME: COVERAGE MAP ============
('home','coverage_eyebrow','Coverage · Eyebrow','text','Nationwide Coverage',300),
('home','coverage_title_1','Coverage · Title','text','Heavy Haul',310),
('home','coverage_title_2','Coverage · Title accent','text','In Your State',320),
('home','coverage_subtitle','Coverage · Subtitle','textarea','We dispatch heavy haul and oversize load transport in every U.S. state, coast to coast.',330),
('home','coverage_card_value','Coverage · Side card big number','text','50 / 50',340),
('home','coverage_card_label','Coverage · Side card label','text','States Covered',350),
('home','coverage_card_note','Coverage · Side card note','textarea','Local dispatchers, nationwide network. Pick a state, we''ll have a rig on it.',360),

-- ============ HOME: WHY US ============
('home','why_eyebrow','Why Us · Eyebrow','text','Why Heavy Haul Group',400),
('home','why_title_1','Why Us · Title','text','Built For Heavy.',410),
('home','why_title_2','Why Us · Title accent','text','Trusted For Every Mile.',420),
('home','why_subtitle','Why Us · Subtitle','textarea','We move what others can''t. Our dispatchers, drivers, and equipment are dedicated 100% to oversize and heavy haul freight.',430),
('home','why_1_title','Why Us · Card 1 title','text','Same / Next Day Dispatch',440),
('home','why_1_desc','Why Us · Card 1 desc','text','Urgent loads moved within hours, not days.',441),
('home','why_2_title','Why Us · Card 2 title','text','Real-Time Updates',450),
('home','why_2_desc','Why Us · Card 2 desc','text','Direct line to your dispatcher from pickup to delivery.',451),
('home','why_3_title','Why Us · Card 3 title','text','Heavy Haul Specialists',460),
('home','why_3_desc','Why Us · Card 3 desc','text','Decades of oversize and superload experience.',461),
('home','why_4_title','Why Us · Card 4 title','text','Competitive Pricing',470),
('home','why_4_desc','Why Us · Card 4 desc','text','Transparent quotes, no hidden fees.',471),
('home','why_5_title','Why Us · Card 5 title','text','Nationwide Network',480),
('home','why_5_desc','Why Us · Card 5 desc','text','Thousands of vetted carriers across all 50 states.',481),
('home','why_6_title','Why Us · Card 6 title','text','Fully Insured Loads',490),
('home','why_6_desc','Why Us · Card 6 desc','text','Cargo and liability coverage on every shipment.',491),

-- ============ HOME: HOW IT WORKS ============
('home','steps_eyebrow','How It Works · Eyebrow','text','Strategic Execution',500),
('home','steps_title','How It Works · Title','text','From Quote To Delivery',510),
('home','step_1_title','Step 1 · Title','text','Request a Quote',520),
('home','step_1_desc','Step 1 · Desc','text','Share your route, equipment and timing.',521),
('home','step_2_title','Step 2 · Title','text','Plan & Assign Carrier',530),
('home','step_2_desc','Step 2 · Desc','text','We secure permits and the right rig.',531),
('home','step_3_title','Step 3 · Title','text','Pickup & Secure Transport',540),
('home','step_3_desc','Step 3 · Desc','text','Loaded, strapped, and on the road.',541),
('home','step_4_title','Step 4 · Title','text','Delivery & Confirmation',550),
('home','step_4_desc','Step 4 · Desc','text','Safe drop-off with proof of delivery.',551),

-- ============ DISPATCH TEAM ============
('dispatchers','eyebrow','Eyebrow','text','Human-Led Logistics',10),
('dispatchers','title_1','Title','text','Meet Your',20),
('dispatchers','title_2','Title accent','text','Dispatch Team',30),
('dispatchers','subtitle','Subtitle paragraph','textarea','No call centers. No bots. Speak directly with the specialized dispatcher handling your load — from quote to confirmation.',40),
('dispatchers','cta_label','CTA button','text','Talk To A Dispatcher Now',50),
('dispatchers','m1_name','Dispatcher 1 · Name','text','Mike',100),
('dispatchers','m1_role','Dispatcher 1 · Role','text','Senior Dispatcher',101),
('dispatchers','m1_years','Dispatcher 1 · Years (number)','text','12',102),
('dispatchers','m1_online','Dispatcher 1 · Online (true/false)','text','true',103),
('dispatchers','m2_name','Dispatcher 2 · Name','text','Sarah',110),
('dispatchers','m2_role','Dispatcher 2 · Role','text','Permits & Routing',111),
('dispatchers','m2_years','Dispatcher 2 · Years (number)','text','9',112),
('dispatchers','m2_online','Dispatcher 2 · Online (true/false)','text','true',113),
('dispatchers','m3_name','Dispatcher 3 · Name','text','Carlos',120),
('dispatchers','m3_role','Dispatcher 3 · Role','text','Oversize Specialist',121),
('dispatchers','m3_years','Dispatcher 3 · Years (number)','text','15',122),
('dispatchers','m3_online','Dispatcher 3 · Online (true/false)','text','true',123),
('dispatchers','m4_name','Dispatcher 4 · Name','text','Danny',130),
('dispatchers','m4_role','Dispatcher 4 · Role','text','Heavy Haul Lead',131),
('dispatchers','m4_years','Dispatcher 4 · Years (number)','text','11',132),
('dispatchers','m4_online','Dispatcher 4 · Online (true/false)','text','false',133),

-- ============ FAQ ============
('faq','eyebrow','Eyebrow','text','Frequently Asked',10),
('faq','title_1','Title','text','Got Questions?',20),
('faq','title_2','Title (line 2)','text','We''ve Got Answers.',30),
('faq','subtitle','Subtitle paragraph','textarea','Most shippers ask the same things before booking. Here are straight answers to the top 8 — pricing, insurance, timing, and more.',40),
('faq','side_note','Side card note','text','Still have a question? Talk to a real dispatcher in under 60 seconds.',50),
('faq','side_email_label','Side card · Email button','text','Email Dispatch',60),
('faq','q1','FAQ #1 · Question','text','How much does heavy haul shipping cost?',100),
('faq','a1','FAQ #1 · Answer','textarea','Most heavy haul shipments range from $2.50 to $5.50 per mile, depending on equipment size, weight, distance, and required permits. Use our instant quote calculator above for a real estimate in 60 seconds. Final pricing always includes permits, pilot cars (if needed), and full insurance — no hidden fees.',101),
('faq','q2','FAQ #2 · Question','text','Are my loads fully insured?',110),
('faq','a2','FAQ #2 · Answer','textarea','Yes. Every shipment is covered by $1,000,000 in cargo insurance and $1,000,000 in liability coverage. We can provide certificates of insurance for your project or jobsite within 15 minutes of booking.',111),
('faq','q3','FAQ #3 · Question','text','How fast can you pick up my equipment?',120),
('faq','a3','FAQ #3 · Answer','textarea','Standard pickups happen within 24–48 hours. Urgent and same-day dispatch is available — we have 12,000+ vetted carriers across all 50 states, so there''s almost always a rig within a few hours of your pickup location.',121),
('faq','q4','FAQ #4 · Question','text','Do you handle permits and pilot cars?',130),
('faq','a4','FAQ #4 · Answer','textarea','Yes — we handle all oversize/overweight permits, route surveys, and pilot car coordination for every state on your route. You don''t lift a finger. Permit costs are included in your quote.',131),
('faq','q5','FAQ #5 · Question','text','What if my equipment is damaged in transit?',140),
('faq','a5','FAQ #5 · Answer','textarea','Damage during transit is extremely rare with our vetted carrier network, but if it ever happens, our $1M cargo insurance covers repairs. We document load condition with photos at pickup and delivery, and our claims team responds within 24 hours.',141),
('faq','q6','FAQ #6 · Question','text','Can I cancel or reschedule my shipment?',150),
('faq','a6','FAQ #6 · Answer','textarea','Yes. You can reschedule for free up to 24 hours before pickup. Cancellations more than 24 hours out are 100% refunded. Inside 24 hours, a small dispatch fee may apply to cover the carrier''s reserved time.',151),
('faq','q7','FAQ #7 · Question','text','Do you ship to Canada and Mexico?',160),
('faq','a7','FAQ #7 · Answer','textarea','Yes. We''re licensed for cross-border heavy haul into Canada and Mexico, including all customs brokerage, FAST/CTPAT clearance, and bilingual coordination.',161),
('faq','q8','FAQ #8 · Question','text','What types of equipment can you haul?',170),
('faq','a8','FAQ #8 · Answer','textarea','Construction equipment (excavators, dozers, cranes), agricultural machinery (combines, tractors), industrial equipment (CNC, generators), heavy-duty trucks (semis, dump trucks), and superloads up to 250,000+ lbs. If it fits on a lowboy, RGN, step deck, or specialized trailer — we move it.',171),

-- ============ GUARANTEES ============
('guarantees','heading_1','Heading','text','Heavy Haul Group',10),
('guarantees','heading_2','Heading accent','text','Guarantee',20),
('guarantees','g1_title','#1 Title','text','On-Time Pickup',30),
('guarantees','g1_sub','#1 Sub','text','Guaranteed Schedule',31),
('guarantees','g2_title','#2 Title','text','Price-Match Promise',40),
('guarantees','g2_sub','#2 Sub','text','Beat Any Valid Quote',41),
('guarantees','g3_title','#3 Title','text','$1M Cargo Insurance',50),
('guarantees','g3_sub','#3 Sub','text','Full Load Coverage',51),
('guarantees','g4_title','#4 Title','text','Vetted Carriers Only',60),
('guarantees','g4_sub','#4 Sub','text','Elite Network',61),

-- ============ TRUST STRIP ============
('trust','t1_top','Item 1 · Top','text','$1,000,000',10),
('trust','t1_bot','Item 1 · Bottom','text','Cargo Insurance',11),
('trust','t2_top','Item 2 · Top','text','MC# 123456',20),
('trust','t2_bot','Item 2 · Bottom','text','FMCSA Authorized',21),
('trust','t3_top','Item 3 · Top','text','USDOT 987654',30),
('trust','t3_bot','Item 3 · Bottom','text','DOT Compliant',31),
('trust','t4_top','Item 4 · Top','text','A+ Rating',40),
('trust','t4_bot','Item 4 · Bottom','text','BBB Accredited',41),

-- ============ SERVICES INDEX ============
('services','hero_eyebrow','Hero · Eyebrow','text','Services',10),
('services','hero_title_1','Hero · Title','text','Heavy Haul',20),
('services','hero_title_2','Hero · Title accent','text','Service Catalog',30),
('services','hero_subtitle','Hero · Subtitle','textarea','Browse every service we offer — from construction iron to cross-border freight. Click any card for trailers, brands, and instant rates.',40),
('services','hero_cta_quote','Hero · Quote button','text','Get Free Quote',50),
('services','featured_eyebrow','Featured · Eyebrow','text','Featured Service',60),
('services','featured_badge','Featured · Badge','text','Popular',70),
('services','featured_title','Featured · Title','text','Tractor Shipping Services',80),
('services','featured_desc','Featured · Description','textarea','Compact, utility, row-crop, high-horsepower, and articulated 4WD tractors hauled nationwide on the right trailer for the job. John Deere, Case IH, Kubota, New Holland & more.',90),
('services','featured_cta','Featured · CTA link text','text','View Tractor Shipping Details',100),

-- ============ ABOUT (cover) ============
('about','masthead_left','Masthead · Left','text','Heavy Haul Group · The Magazine',10),
('about','masthead_center','Masthead · Center','text','Issue No. 01 · 2026',20),
('about','masthead_right','Masthead · Right','text','Vol. XVIII · Nationwide Edition',30),
('about','cover_eyebrow','Cover · Eyebrow','text','Cover Feature · About Us',40),
('about','cover_title_1','Cover · Title line 1','text','Honest.',50),
('about','cover_title_2','Cover · Title line 2','text','Dependable.',60),
('about','cover_title_3','Cover · Title line 3 (accent)','text','Customer-First.',70),
('about','cover_subtitle','Cover · Subtitle','textarea','A nationwide heavy haul network moving oversize loads, construction equipment, agricultural machinery, industrial freight, and heavy duty trucks across all 50 states.',80),
('about','cover_aside_heading','Cover · Aside heading','text','Inside This Issue',90),
('about','cover_phone_label','Cover · Phone label','text','24/7 Direct Line',100);
