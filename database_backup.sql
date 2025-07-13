PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE `beenvoice_account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `beenvoice_invoice_item` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`invoiceId` text(255) NOT NULL,
	`date` integer NOT NULL,
	`description` text(500) NOT NULL,
	`hours` real NOT NULL,
	`rate` real NOT NULL,
	`amount` real NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL, `position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`invoiceId`) REFERENCES `beenvoice_invoice`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO beenvoice_invoice_item VALUES('9b237b0e-d47e-47d3-9351-777d10c84d38','76d570fe-bfec-47bd-a7fa-b4ee8133c78e',64731153600,'Virtual',1.5,20.0,30.0,1752132158,0);
INSERT INTO beenvoice_invoice_item VALUES('8fb85a95-50f9-4375-86d2-5e0e334d87ce','76d570fe-bfec-47bd-a7fa-b4ee8133c78e',64731326400,'In person',3.0,20.0,60.0,1752132158,0);
INSERT INTO beenvoice_invoice_item VALUES('d9f841ae-4c70-4b3d-ba6a-befec3e07693','76d570fe-bfec-47bd-a7fa-b4ee8133c78e',64732363200,'In person',2.0,20.0,40.0,1752132158,0);
INSERT INTO beenvoice_invoice_item VALUES('fd91ea66-4c98-468d-a1ae-1d6715c028c2','76d570fe-bfec-47bd-a7fa-b4ee8133c78e',64732536000,'In person',4.5,20.0,90.0,1752132158,0);
INSERT INTO beenvoice_invoice_item VALUES('bb1b3ccc-35be-47b9-a328-386d7fdc0260','61c3d28c-5031-4372-86e3-5bf895411046',64733054400,'In person',2.5,20.0,50.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('33de41fb-3117-4bef-8ced-b9955538f920','61c3d28c-5031-4372-86e3-5bf895411046',64733140800,'In person',5.5,20.0,110.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('22f8db2c-4d80-4847-8927-7fcce399627e','61c3d28c-5031-4372-86e3-5bf895411046',64733572800,'In person',3.0,20.0,60.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('52d4126f-3e1b-4f11-a1cd-c14f64ef8785','61c3d28c-5031-4372-86e3-5bf895411046',64733745600,'Race day (flat rate)',1.0,100.0,100.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('b9588fcb-2081-44f4-a167-2b51567d89a1','57fcd73a-0876-4e91-9856-0f9c9695fcd1',1621051200,'Race Day (fixed)',1.0,100.0,100.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('fd024a5f-1bf3-4a08-9fb1-fd39502158eb','57fcd73a-0876-4e91-9856-0f9c9695fcd1',1621656000,'Race Day (fixed)',1.0,100.0,100.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('63e0e171-d1f9-43a7-a465-d883b4996b53','57fcd73a-0876-4e91-9856-0f9c9695fcd1',1622865600,'Race Day (fixed)',1.0,100.0,100.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('af8b2c9d-147b-49b4-b0a7-0a98ba63abee','555b1f8c-7a57-427f-bea8-ee4a3f2a2bf2',1620619200,'Fix routers',3.0,20.0,60.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('f9f4712d-9096-4322-978f-3fdff9591939','555b1f8c-7a57-427f-bea8-ee4a3f2a2bf2',1620792000,'Race Day (fixed)',1.0,100.0,100.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('dc0dc83c-093a-42c1-9c8e-b658f5cac7ef','555b1f8c-7a57-427f-bea8-ee4a3f2a2bf2',1621396800,'Race Day (Fixed)',1.0,100.0,100.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('c1d379b1-70ea-44c4-a3cd-d4e1f1510722','555b1f8c-7a57-427f-bea8-ee4a3f2a2bf2',1622520000,'RDP Login Configuration',2.5,20.0,50.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('1212495d-3d81-47ed-ad57-2f938330a95b','555b1f8c-7a57-427f-bea8-ee4a3f2a2bf2',1338696000,'Virtual Database Install/Setup',5.0,20.0,100.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('dfd60b61-908c-4a8e-b768-c471cbf1699a','555b1f8c-7a57-427f-bea8-ee4a3f2a2bf2',1623297600,'Race Day (fixed)',1.0,100.0,100.0,1752132159,0);
INSERT INTO beenvoice_invoice_item VALUES('c79fc31f-2abb-4b4e-968b-8ced90992bfb','4fb5d8be-2588-4187-955d-e7643b08619f',1627617600,'Office Internet/3Play Configuration',4.0,20.0,80.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('286c3631-0a36-4177-83e2-e041d3e5e198','4fb5d8be-2588-4187-955d-e7643b08619f',1627704000,'Race Day (Fixed)',1.0,100.0,100.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('a0599f94-dcbb-4ff7-8f69-f685b200d702','4fb5d8be-2588-4187-955d-e7643b08619f',1628308800,'Race Day (Fixed)',1.0,100.0,100.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('96f1bee1-1117-4fb8-a40a-4fcd485d6528','f48104da-1baa-4a70-9d0c-c03f4017f60d',1628740800,'Stream Deck/Tower Server',2.5,20.0,50.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('41fcea00-259c-433c-8744-1da4297ee261','f48104da-1baa-4a70-9d0c-c03f4017f60d',1628913600,'Race Day (Fixed)',1.0,100.0,100.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('a5a677ea-1c26-4c93-bee5-4e7193d8fc54','f48104da-1baa-4a70-9d0c-c03f4017f60d',1629432000,'Office Server Ransomware/Data Recovery',5.0,20.0,100.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('fc9e7932-aae0-4611-8dfd-439632e02efe','f48104da-1baa-4a70-9d0c-c03f4017f60d',1629518400,'Race Day (Fixed)',1.0,100.0,100.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('14d8f2e4-79a1-4f52-80cb-495422c2ff6c','f48104da-1baa-4a70-9d0c-c03f4017f60d',1629864000,'Race Day (Fixed)',1.0,100.0,100.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('848765c1-2f93-4fe0-bd54-83a8ed6e028b','d0c7c941-d0e4-4d55-b1e5-10ed71f1c9f5',1630728000,'Race Day (Fixed)',1.0,100.0,100.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('28b59943-9beb-4c64-bf94-f10729ef55e9','d0c7c941-d0e4-4d55-b1e5-10ed71f1c9f5',1631332800,'Race Day (Fixed)',1.0,100.0,100.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('ef1b5cc8-046e-4720-9126-365bf2011cef','d0c7c941-d0e4-4d55-b1e5-10ed71f1c9f5',1631419200,'Office Server Data Migration (Online)',2.0,20.0,40.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('07d42569-5d78-4ddc-9146-07c68df081f0','d0c7c941-d0e4-4d55-b1e5-10ed71f1c9f5',1631937600,'Race Day (Fixed)',1.0,100.0,100.0,1752132160,0);
INSERT INTO beenvoice_invoice_item VALUES('f87f4371-4d88-461b-9e20-218841842abd','6c4314c7-7bc7-4d8a-9513-59a1ebcfd890',1635739200,'IT Move server/Vmix/Backups',2.0,20.0,40.0,1752132161,0);
INSERT INTO beenvoice_invoice_item VALUES('fb6b4cf4-b569-42ac-ba14-53e242d07560','6c4314c7-7bc7-4d8a-9513-59a1ebcfd890',1635825600,'Prep In Car Cameras',3.0,20.0,60.0,1752132161,0);
INSERT INTO beenvoice_invoice_item VALUES('f31d6dab-9af3-476c-a272-6e53c3e81a51','6c4314c7-7bc7-4d8a-9513-59a1ebcfd890',1636520400,'Race Day,Islip 300',1.0,100.0,100.0,1752132161,0);
INSERT INTO beenvoice_invoice_item VALUES('0a800d16-bf03-4139-93f6-872a455fbd57','b018eaca-b4b1-4c96-8e40-2a1ab5211e48',1649390400,'Hoosier Tire Scanning',3.0,20.0,60.0,1752132161,0);
INSERT INTO beenvoice_invoice_item VALUES('91c2086d-590a-45ff-8857-006964144c6c','b018eaca-b4b1-4c96-8e40-2a1ab5211e48',1649736000,'SSD Migration/Data Backup',4.0,20.0,80.0,1752132161,0);
INSERT INTO beenvoice_invoice_item VALUES('d705c999-1112-4215-97c8-81888281a27d','b018eaca-b4b1-4c96-8e40-2a1ab5211e48',1650513600,'Roster Numbers/Data Migration',5.5,20.0,110.0,1752132161,0);
INSERT INTO beenvoice_invoice_item VALUES('1cf32daa-b16e-47a9-8d17-3bb65e8bf654','a0da2a05-5681-46fd-b988-235ec24971e2',1651636800,'Laptop setup/Facebook stream',5.0,20.0,100.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('87cee56a-7582-4015-9183-7b917b685b7a','a0da2a05-5681-46fd-b988-235ec24971e2',1652500800,'Race Day',1.0,100.0,100.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('adf5caac-3381-4811-aa9a-fe64c6c0ad20','713a368a-f7de-4de8-95dd-2a4a2d626fa1',1652500800,'Tire Sales (Hoosier)',3.0,20.0,60.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('d278998a-ed4e-47bd-8915-35124d8bc27f','713a368a-f7de-4de8-95dd-2a4a2d626fa1',1652846400,'Raceway CMS Development',6.0,20.0,120.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('694aaa24-b883-4aa1-b365-3e3ded6e9c4f','713a368a-f7de-4de8-95dd-2a4a2d626fa1',1652932800,'Raceway CMS Development',5.0,20.0,100.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('9f5571af-e79e-4254-a370-deb25f16f06c','713a368a-f7de-4de8-95dd-2a4a2d626fa1',1653019200,'Raceway CMS Development',4.0,20.0,80.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('d9f1fcca-a6f1-4f4e-a6ba-52ea102db90a','713a368a-f7de-4de8-95dd-2a4a2d626fa1',1653105600,'Race day (RR)',6.0,20.0,120.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('ebb93ccc-4a9d-4d6f-8584-f044377fdc00','713a368a-f7de-4de8-95dd-2a4a2d626fa1',1653105600,'Tire Sales (Hoosier)',3.0,20.0,60.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('a4f27be7-68ec-492a-b127-21fa207bde52','fac3b7e2-9816-459c-960e-ac520b3f2cd5',1653192000,'Raceway CMS Development',3.0,20.0,60.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('9749ad17-0e9b-4682-8011-aee73425354b','fac3b7e2-9816-459c-960e-ac520b3f2cd5',1653278400,'Raceway CMS Development',3.0,20.0,60.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('29fadf5f-a919-420c-a4a7-778d62b770f9','fac3b7e2-9816-459c-960e-ac520b3f2cd5',1653364800,'Raceway CMS Development',4.0,20.0,80.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('b7f57cc5-ecea-49e3-bb42-15e90dfba1df','fac3b7e2-9816-459c-960e-ac520b3f2cd5',1653537600,'Raceway CMS Development',1.0,20.0,20.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('a8380c9d-0444-4afe-b820-9597a871a903','fac3b7e2-9816-459c-960e-ac520b3f2cd5',1653624000,'Generate points tables on site/tire LAN',4.0,20.0,80.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('fd72e334-4e6a-4462-82a5-cc5a8d3ecda0','fac3b7e2-9816-459c-960e-ac520b3f2cd5',1654056000,'Press Release Publish',1.0,20.0,20.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('7fc11bdd-b740-4c2a-9cf1-2c3bab092f77','fac3b7e2-9816-459c-960e-ac520b3f2cd5',1654315200,'Race Day (RR)',3.0,20.0,60.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('23fbcc77-d0d2-4d0e-90d5-e2f9cab790f7','fac3b7e2-9816-459c-960e-ac520b3f2cd5',1654488000,'PR Archive Integration/Points Update',2.0,20.0,40.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('70be501b-a496-4f40-aebc-a4521fbcf4ba','fac3b7e2-9816-459c-960e-ac520b3f2cd5',1654574400,'Press Release Website Deployment',2.0,20.0,40.0,1752132162,0);
INSERT INTO beenvoice_invoice_item VALUES('9bf35628-6046-44e2-a24f-681ea5bf7bb9','8704d2fe-8972-4dae-8062-2f5b81e14493',1654747200,'Raceway CMS Development',3.0,20.0,60.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('abea397c-2ea5-4788-9560-42ea0d508bce','8704d2fe-8972-4dae-8062-2f5b81e14493',1654833600,'Raceway CMS Development',3.0,20.0,60.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('99590ee9-7e6a-40ec-8925-b135457ba01e','8704d2fe-8972-4dae-8062-2f5b81e14493',1655092800,'TRMM Installation/Script Writing',3.0,20.0,60.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('e1f534be-9fe8-42f1-8ef4-bc4073d8ce2b','8704d2fe-8972-4dae-8062-2f5b81e14493',1655265600,'PC Updates',2.0,20.0,40.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('7e619cdf-af99-4c58-be0e-227324710e4e','8704d2fe-8972-4dae-8062-2f5b81e14493',1655352000,'3Play Remote Access Setup',2.0,20.0,40.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('7fd71054-7626-4f53-94e9-5fc4006ca3c4','8704d2fe-8972-4dae-8062-2f5b81e14493',1655524800,'Race Day',8.0,20.0,160.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('c9d74e45-d270-45b4-9332-25db44c9d6d1','8704d2fe-8972-4dae-8062-2f5b81e14493',1655697600,'Move and reassign printer',3.0,20.0,60.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('ae2ef12b-43b2-454e-90bf-d8b150f89278','8704d2fe-8972-4dae-8062-2f5b81e14493',1655870400,'Website updates/PR Logic',2.0,20.0,40.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('f96d139f-7f40-4a25-89cc-05510c782a7d','8704d2fe-8972-4dae-8062-2f5b81e14493',1656302400,'Website updates',2.0,20.0,40.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('e4c9c5ac-ee0d-490f-9f84-c542ad4b7c5c','8704d2fe-8972-4dae-8062-2f5b81e14493',1656475200,'Website updates/schedule/press-release',2.0,20.0,40.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('fb35940e-4199-4de8-a163-5ffac86ab0c4','babfc847-b37d-44f2-91a9-4251691c11b4',1658376000,'Server updates and TMM',5.0,20.0,100.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('8f4a5ca2-88d9-403e-9098-6b398d4be218','babfc847-b37d-44f2-91a9-4251691c11b4',1658548800,'Race Day (RR)',9.0,20.0,180.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('9107c846-b7b9-4d37-aecf-8b7cbc6cfc70','babfc847-b37d-44f2-91a9-4251691c11b4',1658721600,'CMS Development (remote)',4.0,20.0,80.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('51e881b1-0e7f-4bcd-87da-3512e2345337','babfc847-b37d-44f2-91a9-4251691c11b4',1658808000,'CMS Development (remote)',4.0,20.0,80.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('707b9108-81ea-4af6-aa2f-0de09220a1a8','babfc847-b37d-44f2-91a9-4251691c11b4',1658894400,'CMS Development (remote)',4.0,20.0,80.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('9d4c904c-2421-442f-9b45-09a330de83a4','babfc847-b37d-44f2-91a9-4251691c11b4',1658980800,'CMS Development (in person)',5.0,20.0,100.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('5685ea85-1190-45b5-bc0b-65d3a0ae37f5','babfc847-b37d-44f2-91a9-4251691c11b4',1659153600,'Race Day (Hoosier)',4.0,20.0,80.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('1d14d0de-642f-4266-a466-30ba7773b55f','babfc847-b37d-44f2-91a9-4251691c11b4',1659153600,'Race Day (RR) / Drone photography',6.0,20.0,120.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('93dfc1f6-e3d7-4c5a-8684-32534458bae9','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1660017600,'Update points, change prices, fix pdf display',1.0,20.0,20.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('24f10b26-5ccb-4217-ae89-11d601b16f67','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1660104000,'Add Penalty Reports to CMS',3.0,20.0,60.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('f0f74076-daed-4e92-9693-ede280cc3e19','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1672203600,'Server drive replacement/data recovery',4.0,20.0,80.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('40e280f9-1a60-4765-9d3c-bbd6f7546e0a','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1643605200,'Add PR support to CMS',4.5,20.0,90.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('c3160122-ac8c-4e1e-9f12-be70dae50d38','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1643691600,'Deploy PR update to CMS backend',3.0,20.0,60.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('1c23838c-134e-486a-8e94-7d2d085ce4b2','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1643778000,'Update database schema to support PR',2.0,20.0,40.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('c6c1d55b-0895-4e4c-9b48-2de18dd4b3a8','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1643778000,'Patch riverheadraceway.com frontend for PR',2.5,20.0,50.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('1ce0b765-4330-454e-b339-679d3a61560c','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1644123600,'Begin new schema for schedule upload',2.0,20.0,40.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('41f3b4a2-d0ac-4813-8c97-353151735140','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1644642000,'Prototype rules upload page',3.0,20.0,60.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('296f2767-f2a1-48ee-afdd-7d9e5a5d4373','89f677fb-ca0f-4d43-9547-d4da77f0f0ba',1644814800,'Rules CMS page backend dev',1.0,20.0,20.0,1752132163,0);
INSERT INTO beenvoice_invoice_item VALUES('6df444f9-9013-4ba4-889f-288687bf40cd','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1679025600,'Website fixes, Orbits Suite Update (5.9)',4.0,20.0,80.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('b8b7d422-8eb4-4550-8b8c-75d1eebb606c','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1679284800,'Backblaze B2 Backup setup for VMs/web',7.0,20.0,140.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('0a871404-dd23-47ae-9b53-4db1762424db','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1679371200,'Install and provision Active Directory SRV',4.5,20.0,90.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('e6ae1b2c-e842-431d-b2d1-fbe46f0d29d5','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1679457600,'Update BackBlaze configurations',2.0,20.0,40.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('f540b78f-10a7-4f10-9409-10f54eff831e','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1679457600,'Website edits',1.0,20.0,20.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('7dd05c87-6a3e-40e6-836a-63dd7e22d52c','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1679544000,'Remove policies from website',0.5,20.0,10.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('5dd99069-2388-4daa-b304-a5e6f000bbaa','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1679544000,'Add dynamic roster to website',3.5,20.0,70.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('64f37c00-5f5f-49d3-85bc-786d083abc01','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1679630400,'Update handicapping rules, modify reserved',1.5,20.0,30.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('f7845e1a-cfaf-4b97-9404-985c578cd35d','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1679889600,'Update CMOD rules, separate bandos',1.0,20.0,20.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('1967e5b2-98ae-493b-ba34-b28c81ebeed9','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1681272000,'Separate/ configure user accounts for FM',2.0,20.0,40.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('623d2cee-7c09-4626-bff7-16b4af75a3ac','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1681704000,'Generate and email RDP deployments',1.0,20.0,20.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('9a5cac21-e2f8-4028-b90d-2f1d1701abb6','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1681876800,'Generate roster CSV and convert to FM',2.0,20.0,40.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('dda3b050-8ad8-45fb-bee5-48bc2e94c469','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1682395200,'Troubleshoot FM access',1.5,20.0,30.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('2e562992-b42e-4d1d-99eb-ff354b2194d8','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1682568000,'Generate login certificates/install FM server',2.0,20.0,40.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('8542b97d-a5e5-4a95-b143-9677c9ca2c09','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1683000000,'Reset RDP cache on Vmix PC/initialize',1.5,20.0,30.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('54ba18de-ae79-4f36-a5f7-5e112e7033fe','2a07bf2e-1923-4b4b-aba9-14c507a2f2c4',1683086400,'Unify user accounts on AD for FM',2.5,20.0,50.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('6446d0af-4267-42fb-b929-18705adf748a','0b057a65-fe7d-4495-8756-4dd61f6895e1',1683777600,'On-site- printer and system update/config',7.0,20.0,140.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('967b4092-caf5-4fe9-94ae-9ad05d021abd','0b057a65-fe7d-4495-8756-4dd61f6895e1',1683950400,'Race day',7.0,20.0,140.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('d13204e9-14e8-4cf6-af8d-0d554f865897','0b057a65-fe7d-4495-8756-4dd61f6895e1',1684123200,'FM Maintenance/Web development',5.0,20.0,100.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('e3e9ce1b-ed84-47e3-822f-f844b7aa0484','0b057a65-fe7d-4495-8756-4dd61f6895e1',1684209600,'PointsSplitter Script (Remote)',1.5,20.0,30.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('eb535a1b-315f-4457-b742-72d01419b2cd','0b057a65-fe7d-4495-8756-4dd61f6895e1',1684296000,'vMix,New ticker and sponsors',5.0,20.0,100.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('8c318cea-7d7d-4ec5-a6df-63b46e1d36be','0b057a65-fe7d-4495-8756-4dd61f6895e1',1684382400,'Web Development (Remote)',4.0,20.0,80.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('6def29d4-4511-4705-b963-29717f881a7a','0b057a65-fe7d-4495-8756-4dd61f6895e1',1684468800,'MyRacePass/Website',5.0,20.0,100.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('2a3a5028-d561-43ac-af77-2a2af562b145','0b057a65-fe7d-4495-8756-4dd61f6895e1',1684641600,'Race day',5.0,20.0,100.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('d4cba322-8a53-4f72-9e10-16388bbc5e51','f86f4002-6539-44a3-b8c9-ca6689f809c1',1684728000,'MyRacePass Data/FM Server/3Play',4.5,20.0,90.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('d2180f5c-685d-4f5e-8a03-b8f6804bbf31','f86f4002-6539-44a3-b8c9-ca6689f809c1',1684814400,'FileMaker Troubleshooting/Maintenance',2.5,20.0,50.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('7feefdb6-1a66-439c-8013-a354d7af4284','f86f4002-6539-44a3-b8c9-ca6689f809c1',1684900800,'New graphics suite',5.5,20.0,110.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('d23b7924-9acc-48c4-9d09-067b6f12c0b6','f86f4002-6539-44a3-b8c9-ca6689f809c1',1685073600,'TV Lineups program',7.0,20.0,140.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('6bd45327-8f01-4dab-8a92-9b76363ce2d3','f86f4002-6539-44a3-b8c9-ca6689f809c1',1685160000,'Race Day',7.0,20.0,140.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('77d6c533-8d6b-437f-b3bb-7f51dd8f8e5b','f86f4002-6539-44a3-b8c9-ca6689f809c1',1685505600,'PC Maintenance',5.5,20.0,110.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('d83da575-2e45-4dd6-bf39-4f1b553a3d4f','f86f4002-6539-44a3-b8c9-ca6689f809c1',1685592000,'Web Development/CMS backend update',6.0,20.0,120.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('9dfc99e1-87b2-4487-90e2-3d7410bf771f','f86f4002-6539-44a3-b8c9-ca6689f809c1',1685592000,'Equipment Purchase - Black Box',1.0,170.0,170.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('f0ed5f32-fa79-43d8-bbb1-02859b9a9f7d','f86f4002-6539-44a3-b8c9-ca6689f809c1',1685678400,'TV setup and wiring',3.0,20.0,60.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('8e754e3f-eee4-4af7-93c4-1238f32d572c','f86f4002-6539-44a3-b8c9-ca6689f809c1',1685764800,'Race Day',3.0,20.0,60.0,1752132164,0);
INSERT INTO beenvoice_invoice_item VALUES('62ea502c-a52a-462d-93ed-8deb5b8b97af','ef6a5079-2d65-46b1-8d87-a9ef5c0cb650',1685937600,'Website updates, capture card fix',5.0,20.0,100.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('97e3d7c5-a2bc-484b-90ee-8883fafd6842','ef6a5079-2d65-46b1-8d87-a9ef5c0cb650',1686024000,'Web dev',4.0,20.0,80.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('c2fc47ee-9c96-4b66-9a87-fe52054ab6e7','ef6a5079-2d65-46b1-8d87-a9ef5c0cb650',1686110400,'Website work, Itinerary/Roster fixes',5.0,20.0,100.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('08aab334-1ef7-470e-b02b-99b8991cbf78','ef6a5079-2d65-46b1-8d87-a9ef5c0cb650',1686283200,'Quickbooks reinstall/drive copy (on-site)',1.0,20.0,20.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('17957359-ecdd-49be-8a23-257c7bc45e81','ef6a5079-2d65-46b1-8d87-a9ef5c0cb650',1686283200,'Web development',5.0,20.0,100.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('bc1cb3aa-3d66-4b6d-9089-6bdda101503c','ef6a5079-2d65-46b1-8d87-a9ef5c0cb650',1686369600,'Race Day',7.0,20.0,140.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('3489a122-5983-461f-bf54-edc0df82a89d','9da8c49f-f6e5-4e5d-8da6-2c1baaf1e5cb',1687492800,'Reset passwords, hide enduro points',1.5,20.0,30.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('afc213f9-5738-48a2-9be2-91264ee2fd70','9da8c49f-f6e5-4e5d-8da6-2c1baaf1e5cb',1688356800,'On-site website work',6.5,20.0,130.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('5c7c9b42-8da1-4cfe-a683-b2175588d4a0','9da8c49f-f6e5-4e5d-8da6-2c1baaf1e5cb',1688443200,'Remote website work',3.5,20.0,70.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('ee858f44-df11-4754-a105-418a0c392f5a','9da8c49f-f6e5-4e5d-8da6-2c1baaf1e5cb',1688443200,'Microsoft Office 2019 ProPlus',1.0,30.0,30.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('ddf90623-e1c7-4d77-b215-20e3bdcf057c','9da8c49f-f6e5-4e5d-8da6-2c1baaf1e5cb',1688529600,'On-site website work',6.0,20.0,120.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('62185930-638a-4de1-80f4-cb594af09848','9da8c49f-f6e5-4e5d-8da6-2c1baaf1e5cb',1688702400,'On-site website work',9.0,20.0,180.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('c4a6df10-ff6b-475f-9614-3ab87bc891dc','9da8c49f-f6e5-4e5d-8da6-2c1baaf1e5cb',1688788800,'Race Day',9.0,20.0,180.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('6c7cb646-294c-4279-bd78-986b84b99c01','9da8c49f-f6e5-4e5d-8da6-2c1baaf1e5cb',1688875200,'Website work',3.0,20.0,60.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('b4575be6-65d8-435d-974f-e3a741500ba4','9186435f-2b62-4c58-aa45-c00aeac9c7d6',1688961600,'On-site website work',7.0,20.0,140.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('f2282616-a3f4-4920-9d12-c89251d67468','9186435f-2b62-4c58-aa45-c00aeac9c7d6',1689048000,'Remote website work',6.5,20.0,130.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('ede3c1c2-d80e-489a-945d-a61e24e15f1f','9186435f-2b62-4c58-aa45-c00aeac9c7d6',1689134400,'Remote website work',7.0,20.0,140.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('af24fb33-cde7-4bb8-a0ba-b81a9fb6222c','9186435f-2b62-4c58-aa45-c00aeac9c7d6',1689220800,'On-site computer work',4.0,20.0,80.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('1e16ad5f-a961-46ed-a58c-4423a830839c','9186435f-2b62-4c58-aa45-c00aeac9c7d6',1689220800,'Remote website work',4.0,20.0,80.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('b575b193-ce8e-415c-8689-6a8fac8e7a1f','9186435f-2b62-4c58-aa45-c00aeac9c7d6',1689307200,'On-site computer/website',7.0,20.0,140.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('2f4fd87b-4a2e-4ddb-88c3-770a36bf5640','9186435f-2b62-4c58-aa45-c00aeac9c7d6',1689393600,'Race Day',6.0,20.0,120.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('b2525223-cf5e-4a2e-a07c-ba3972f51409','9186435f-2b62-4c58-aa45-c00aeac9c7d6',1689393600,'Acer SB220Q',1.0,80.0,80.0,1752132165,0);
INSERT INTO beenvoice_invoice_item VALUES('c859a866-6487-432d-ad05-cf6bc732c6c6','a722008f-f269-4018-b755-b25cd2c5471a',1658030400,'Website (off-site)',3.0,20.0,60.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('284084d7-cb14-40db-8017-99aa6182741f','a722008f-f269-4018-b755-b25cd2c5471a',1658116800,'Website (on-site)',6.0,20.0,120.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('ea1457ef-79a9-4d36-95e9-98667ab57de4','a722008f-f269-4018-b755-b25cd2c5471a',1658203200,'Website (off-site)',4.0,20.0,80.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('64d111a0-6371-44d5-994d-afd5e47491ca','a722008f-f269-4018-b755-b25cd2c5471a',1658289600,'Move ThinkCentre/Tires',7.0,20.0,140.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('a853c17d-bc3e-45a4-88d0-48ca01631e88','a722008f-f269-4018-b755-b25cd2c5471a',1658376000,'Audience Display and Points',5.0,20.0,100.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('8118f5c5-9570-4e93-ab07-9262ca30b3bb','a722008f-f269-4018-b755-b25cd2c5471a',1658376000,'Website (off-site)',4.0,20.0,80.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('55120798-2208-48e9-b617-804e595f35e7','a722008f-f269-4018-b755-b25cd2c5471a',1658462400,'Race Day',7.0,20.0,140.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('327193a6-9393-498e-8bb3-caff95069727','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690171200,'Website work and graphics',5.0,20.0,100.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('8ff3daae-0a76-4df9-b94f-7e1aa954a3aa','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690257600,'Website backend (off-site)',3.5,20.0,70.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('d2684ffe-51ab-4f20-8539-b7d1a1b76f87','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690344000,'Headshots and placeholders',5.5,20.0,110.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('c9bf1a18-b45e-4c5f-abf4-34cf709fe689','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690430400,'Lineups and auth security (off-site)',4.5,20.0,90.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('97cc7b06-caa1-4a75-b1f7-3f95ab0b5e19','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690516800,'Audience display, news editor, prices',6.0,20.0,120.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('6d9aeec4-a3de-4faa-be35-feacdb39e350','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690603200,'Price editor, begin database migration',6.0,20.0,120.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('eab32b2d-9edb-4a71-ad92-11d872857be9','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690689600,'Database migration, match up 2022 reg',6.0,20.0,120.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('0c133b57-d722-47a0-b390-c7ada5e555d9','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690776000,'Begin express registration (auto) (on-site)',3.0,20.0,60.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('3e8072e3-d462-492c-a32e-5bafa12ac66d','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690776000,'Finalize express registration (off-site)',4.0,20.0,80.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('1ef0a686-5c33-4bce-892e-b72cb4f6528a','ed3cf514-1438-4ee0-8e72-3f47c0f9aa15',1690862400,'Champion bios, rework points for new DB',6.0,20.0,120.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('9f75cdeb-4833-4325-abdf-f392c8be311b','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1690948800,'Race Day',8.5,20.0,170.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('8ca5bc48-ae7c-458d-9ae5-da54edb580bd','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691035200,'Website hotfixes',3.0,20.0,60.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('bf316f01-6d97-4887-bbb4-7f6bc04e1075','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691121600,'Tire/Office swap, website final touches',5.5,20.0,110.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('37f86e75-a336-4f7b-ae0c-345dd584d1a1','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691208000,'Race Day/Website publish',6.0,20.0,120.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('ddedea49-53f5-4d91-913d-48156ac2b4cc','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691380800,'Database fixes (on-site)',3.5,20.0,70.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('a1315055-0a28-4a70-9701-433201cd4870','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691380800,'Draft wall of champions page',3.0,20.0,60.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('4e858515-b73a-411e-90ca-605b396c7d9c','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691553600,'Webcam/Wall of champions (on-site)',6.0,20.0,120.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('e8121138-1871-41f0-8904-0f43ce5e4690','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691553600,'Wall of Champions Finalize/Publish',4.0,20.0,80.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('480dca64-e20f-43a9-8b6c-77acd8902f3d','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691640000,'Migrate to managed DB/Hall of Fame',7.5,20.0,150.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('34d04265-a18f-4ec7-9031-7141fe411c28','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691726400,'WiFi install, laptop setup, Add results to site',4.5,20.0,90.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('ce8e3f34-5c0b-4e51-80f9-13ef76a05e74','c7e84ee9-ae1e-4f31-b120-6cc7e02b0442',1691812800,'Race Day',5.0,20.0,100.0,1752132166,0);
INSERT INTO beenvoice_invoice_item VALUES('771c15eb-0062-43ca-9a72-cc76069cd02a','e18f8253-59a5-45ab-9070-8397930c8e12',1692676800,'Points repair',1.0,20.0,20.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('dfe1d780-2ce9-4aa3-bafe-692dfc5e4e3f','e18f8253-59a5-45ab-9070-8397930c8e12',1692936000,'Add JuiceBox division to site',2.0,20.0,40.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('d925981d-a0cc-4902-83e4-72cea6400014','e18f8253-59a5-45ab-9070-8397930c8e12',1693022400,'Prep site for ISP300 ticket/reg sale',2.5,20.0,50.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('7ac101d2-21a3-423b-ae3e-d7e796cad4cb','e18f8253-59a5-45ab-9070-8397930c8e12',1693972800,'Bring up old database site',2.0,20.0,40.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('30633312-1e3a-4bd6-9e36-d56a0c455a7c','e18f8253-59a5-45ab-9070-8397930c8e12',1694750400,'Fix registration car check',1.0,20.0,20.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('88f0b570-6406-42c8-adcb-fedd96bcbd1f','e18f8253-59a5-45ab-9070-8397930c8e12',1694836800,'Implement season ID system',2.0,20.0,40.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('cbc4efa9-f68e-44f9-b535-eee608c54a9e','e18f8253-59a5-45ab-9070-8397930c8e12',1695268800,'Update website content manager',2.0,20.0,40.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('e0e20b6f-dcd0-442c-a6c1-108c8a2d4c44','e18f8253-59a5-45ab-9070-8397930c8e12',1695355200,'Add toggle to event visibility, update events',3.0,20.0,60.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('e8a37197-cf61-4e50-a6ef-f4bc16caf583','e18f8253-59a5-45ab-9070-8397930c8e12',1696305600,'Design/implement BCA month graphics',2.5,20.0,50.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('53e884d4-0e44-47ae-9de1-a08e502166d8','e18f8253-59a5-45ab-9070-8397930c8e12',1696392000,'Create special event season/reg',4.0,20.0,80.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('d275522f-1659-473a-badc-70abe80aeb07','e18f8253-59a5-45ab-9070-8397930c8e12',1696478400,'Special event roster viewer',2.5,20.0,50.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('ccc37a05-5b94-4e8b-a804-167d7d86664e','e18f8253-59a5-45ab-9070-8397930c8e12',1696564800,'Add fee/payment process to special events',1.0,20.0,20.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('920b3a78-9957-4c32-b5ed-df46c297e5fc','e18f8253-59a5-45ab-9070-8397930c8e12',1696910400,'Email update (hide personal data from all)',3.0,20.0,60.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('85ff6150-7947-41d8-b408-1a816aa0fc76','e18f8253-59a5-45ab-9070-8397930c8e12',1697601600,'Update internal roster viewer for full data',2.0,20.0,40.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('8d4d28e2-db87-4a36-891c-2cee4b161bc9','e18f8253-59a5-45ab-9070-8397930c8e12',1697688000,'DB sanitization, prep for export 1099',1.5,20.0,30.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('0d68af50-8887-467a-b1d0-1071e2c479e3','e18f8253-59a5-45ab-9070-8397930c8e12',1698206400,'Add special event roster viewer to site',4.5,20.0,90.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('c84b3e48-f1b6-4199-bcdd-6f8685b2774f','f39a6380-e1c0-4a28-b25e-f960e40ebbdc',1698811200,'SE roster, change theme, update events.',4.0,20.0,80.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('e9a56413-22c6-4736-8e60-d510bb2ae953','f39a6380-e1c0-4a28-b25e-f960e40ebbdc',1698897600,'SE roster visibility, live DB detection',3.0,20.0,60.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('aa720f49-b51a-437b-a413-4a9f6a4f9544','f39a6380-e1c0-4a28-b25e-f960e40ebbdc',1699070400,'CMS RosterView Update',7.0,20.0,140.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('bf2c1ba6-8d19-4280-84ce-8173b863c23c','f39a6380-e1c0-4a28-b25e-f960e40ebbdc',1699246800,'CMS Backend Redesign (OOP)',4.0,20.0,80.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('704f9d4a-27d6-4b25-af11-43ac8211959b','f39a6380-e1c0-4a28-b25e-f960e40ebbdc',1699333200,'Various DB/Roster updates/exports',2.5,20.0,50.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('2bc45810-c0bb-4150-9191-e27efa42d7c4','f39a6380-e1c0-4a28-b25e-f960e40ebbdc',1700197200,'Shopify Website Design/Setup',4.5,20.0,90.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('208cea71-e378-494d-bcff-92c19ead51b7','f39a6380-e1c0-4a28-b25e-f960e40ebbdc',1700370000,'Special Event Mail Merge',2.5,20.0,50.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('a5f209a2-a65e-4e29-a137-4381bb477327','f39a6380-e1c0-4a28-b25e-f960e40ebbdc',1700456400,'Special Event Envelope Automation',1.0,20.0,20.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('95d8a07d-a5c2-4453-9795-c35cc7fc82b3','352863b6-4bcd-4060-9aee-7a1493381646',1701752400,'Compress all images for quicker site load',2.5,20.0,50.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('02d59723-bdd7-4bba-ba74-adfa0cfc7a16','352863b6-4bcd-4060-9aee-7a1493381646',1701838800,'Begin banquet registration',3.5,20.0,70.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('c58588d4-ac5b-424b-98ad-340157190c5e','352863b6-4bcd-4060-9aee-7a1493381646',1702357200,'Banquet registration database setup',2.0,20.0,40.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('407e13d3-4e35-4ec4-a9a0-95c0916193a0','352863b6-4bcd-4060-9aee-7a1493381646',1702443600,'Banquet reg stripe price generation',2.0,20.0,40.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('093d4237-83de-4d7f-9e5c-42a719726a03','352863b6-4bcd-4060-9aee-7a1493381646',1702616400,'Online store theming/UI',3.5,20.0,70.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('eaad59e0-1324-4a00-b443-d614fd56a227','352863b6-4bcd-4060-9aee-7a1493381646',1702702800,'Online store pricing/payment',2.0,20.0,40.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('36228c80-bc0a-4940-b088-4904b17899e7','352863b6-4bcd-4060-9aee-7a1493381646',1703566800,'Finalize banquet registration',5.5,20.0,110.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('a694d9db-b50c-4863-b552-c80b19f53222','352863b6-4bcd-4060-9aee-7a1493381646',1703653200,'Update champions and win tallys',2.0,20.0,40.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('22612fae-9421-40d9-900e-643638ca7531','352863b6-4bcd-4060-9aee-7a1493381646',1703826000,'Show prev rosters, add announcements',4.5,20.0,90.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('b39974ea-cd78-4271-b6f0-60c9b8c4911c','352863b6-4bcd-4060-9aee-7a1493381646',1703912400,'CMS banquet roster visibility',4.0,20.0,80.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('06bc2406-bbbe-4daa-96d7-d80151aa41e0','352863b6-4bcd-4060-9aee-7a1493381646',1704171600,'Hide registration for fixes, refund users',3.0,20.0,60.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('1adee95a-f05a-4f2c-b648-ee1af13ed1ff','352863b6-4bcd-4060-9aee-7a1493381646',1704517200,'Convert to store-pay-update for 2024 reg',3.0,20.0,60.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('066c172c-debd-4227-bbc1-0e4eb8d4d74e','352863b6-4bcd-4060-9aee-7a1493381646',1704603600,'Finalize and publish 2024 registration',5.0,20.0,100.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('3ae082a5-3e30-401c-8757-29306ae32dae','352863b6-4bcd-4060-9aee-7a1493381646',1704776400,'New events editor, disable letters for 2024',7.0,20.0,140.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('2b5c2d59-4611-4f69-8859-3f7e7d3b294e','352863b6-4bcd-4060-9aee-7a1493381646',1704862800,'Rules uploader',8.0,20.0,160.0,1752132167,0);
INSERT INTO beenvoice_invoice_item VALUES('05304002-9b6c-423b-bbee-4637d67041a5','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1704949200,'In-person Track Day',7.5,20.0,150.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('fd6e3b70-9198-4aa2-be41-f2186bfeb52a','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1705035600,'Banquet export and mail merge',2.0,20.0,40.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('4f662168-ed58-4fa5-99ae-d79eeeae201e','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1705208400,'Number reservations',1.0,20.0,20.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('90373154-537e-43a0-82a8-fcc036514461','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1705381200,'Division page hotfix',0.5,20.0,10.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('67fc6ed2-e430-4e28-90dc-c40bd7c2e3b4','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1705467600,'Auto display driver registrations',3.0,20.0,60.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('6d680a14-f864-4047-8c3b-ff6afcdaf10c','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1705640400,'Shopify Finances',2.0,20.0,40.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('c7ca7f6d-bba8-436f-9ecc-13b7e67993c7','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1705813200,'Banquet Mail Merge pt.2',2.0,20.0,40.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('18154b9a-0377-48ee-b3b6-64e0aafa45ff','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1705813200,'Banquet ticket close/clean up',1.0,20.0,20.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('6f2849cc-65d9-44fe-8b12-82c551fa71a2','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1706245200,'Take down schedule, fix event publisher',4.0,20.0,80.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('f0a627d2-5f3a-4a9c-ab54-f7da5a304b00','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1706590800,'Permissions, sponsor links',2.0,20.0,40.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('f0349c88-43ff-4dba-9cfe-5940713b1612','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1707022800,'Begin new roster viewer/editor',5.0,20.0,100.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('fcafdfbb-6f33-44d0-8044-4450b772b061','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1707109200,'Roster editor UI/Tables',4.0,20.0,80.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('f3b99670-1f60-4e87-bb80-95170ddd784f','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1707368400,'Roster editor,change participants/autofill',4.5,20.0,90.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('10134ca6-0e8a-4c41-a91b-13945a12a4cb','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1707454800,'Roster editor,Auto tax form generation',6.5,20.0,130.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('a3b9aaec-8ba1-49fc-b1a9-7506fd84460a','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1707627600,'Update CMS navigation',3.0,20.0,60.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('52460b23-e519-4fc6-ac89-46576070f9f3','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1707714000,'CMS User Manager/Perms editor',5.0,20.0,100.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('c80150ba-34fb-4b9b-a9a5-78024e7b5e40','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1708837200,'NASCAR Reg Link, general typos',0.5,20.0,10.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('4c88ca6d-482e-489c-9da9-16fa2cc8bd00','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1710129600,'Track day',4.0,20.0,80.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('5c8995f6-b191-4ba6-b129-0537785e156e','dc0e0595-07a8-471b-8f7b-23cd13c0b8c1',1710216000,'Event page custom links',2.0,20.0,40.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('0b2c3bc2-be20-4c16-b384-9d5bd1e2e693','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1710388800,'Track Day',3.5,20.0,70.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('78553d71-aa77-4791-8ec1-0d2b43973308','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1710475200,'Remote Onedrive Support',1.0,20.0,20.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('e7902386-266d-4b8a-85ce-47851e181d02','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1710907200,'Data collection/analysis for site',2.5,20.0,50.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('23c59227-54d9-43ad-9b34-a554b52ba74f','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1711339200,'Driver 1099/W-9 generation update',5.0,20.0,100.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('d18e53f0-ead0-4b56-b56c-be2b7671e7ea','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1711425600,'Itinerary search/export',2.0,20.0,40.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('51f1ebdd-f68b-40c6-83b7-d3b413882360','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1711512000,'Itinerary resend, Reg data export/merge',3.0,20.0,60.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('f4145173-a276-458c-a8d3-c8b94b5c4cf5','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1711598400,'Fix itinerary missing from website',3.0,20.0,60.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('6dd9e3c8-7def-48a2-840b-a72de7e1c753','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1711944000,'Roster/Itinerary updates',2.0,20.0,40.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('61b692a2-8c63-4061-9f35-30844a2cedd1','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1712548800,'Roster download link',1.0,20.0,20.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('a571bef7-b402-4316-b4db-209679d67fed','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1712721600,'Roster phone number export patch',2.5,20.0,50.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('38290567-dc1f-420c-8a74-1fda829e218d','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1712808000,'Stripe support contact/ticket',3.0,20.0,60.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('5835c23b-3872-45e8-b7fc-1e9884313a26','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1713153600,'Credit card charge match with stripe',1.5,20.0,30.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('f7e8504f-a95c-4921-9859-6f5c0687b1ad','cf6ea6c8-c485-4a01-aa12-f68306ef426a',1714017600,'Exit cleanup/account reassignment',3.0,20.0,60.0,1752132168,0);
INSERT INTO beenvoice_invoice_item VALUES('02602261-24d0-4546-88da-ff9fb14c3eed','1942364d-df4e-4175-8210-dbc202ca1038',1733979600,'Begin racehub-next development',4.5,25.0,112.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('c6334fbb-6892-4760-a61c-5cdc04921c72','1942364d-df4e-4175-8210-dbc202ca1038',1734066000,'Migrate basic features, authentication',4.0,25.0,100.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('33957386-0976-4800-a01d-2a5977e8df2a','1942364d-df4e-4175-8210-dbc202ca1038',1734498000,'Logistics planning and roadmap',1.0,25.0,25.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('dacda1bb-a445-4cdc-bdc5-db3bd1f48de1','1942364d-df4e-4175-8210-dbc202ca1038',1734670800,'Change racehub-php season, begin DB',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('d5bddee3-1892-4c7b-bab9-50598fcf7d83','1942364d-df4e-4175-8210-dbc202ca1038',1734757200,'Events page integration, rich homepage',5.5,25.0,137.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('3d80aba0-53d9-40d9-a163-5dc6aff36320','1942364d-df4e-4175-8210-dbc202ca1038',1734930000,'Create news page, optimize loading flow',5.0,25.0,125.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('f21fba61-87c1-4426-af99-450e42c193f5','1942364d-df4e-4175-8210-dbc202ca1038',1735016400,'Begin DigitalOcean provisioning/deploy',2.5,25.0,62.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('86ec004d-cc98-4c37-9943-1a7f60170d69','1942364d-df4e-4175-8210-dbc202ca1038',1735189200,'Deploy app/DB, news page optimizations',6.0,25.0,150.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('ab7cc962-5024-48e6-979a-885ccf6a7194','1942364d-df4e-4175-8210-dbc202ca1038',1735275600,'Fix deployment issues, integrate DO App',6.0,25.0,150.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('08d9e276-6dcf-4e50-9de5-dd13b580fe6f','1942364d-df4e-4175-8210-dbc202ca1038',1735362000,'Add image compression, content delivery',6.0,25.0,150.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('6a243898-3ef9-47f0-9008-9e3fca0a1c33','1942364d-df4e-4175-8210-dbc202ca1038',1735448400,'Announcements, Promo, Sponsors CMS',6.0,25.0,150.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('23059eac-34fb-44d2-9c36-1e10e387167d','1942364d-df4e-4175-8210-dbc202ca1038',1704171600,'Begin competitors page',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('9758e516-7655-4410-9f12-b069326ff3e2','1942364d-df4e-4175-8210-dbc202ca1038',1704258000,'Migrate APIs to tRPC for data security',4.0,25.0,100.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('628da274-f479-4603-bde2-9556795a6d4d','1942364d-df4e-4175-8210-dbc202ca1038',1704344400,'Recreate articles CMS for rich text',6.0,25.0,150.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('12a7c5ef-4029-410f-b176-a52966015698','1942364d-df4e-4175-8210-dbc202ca1038',1704430800,'Migrate announcements editor, add raindate',4.0,25.0,100.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('bea4d148-602b-4cc6-a1a9-4b9a7717c050','1942364d-df4e-4175-8210-dbc202ca1038',1704517200,'Discuss and plan out site scope (In-person)',2.0,25.0,50.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('d286c494-64c4-4eaf-9a8d-5ad681b4413b','1942364d-df4e-4175-8210-dbc202ca1038',1704517200,'Implement reports, rules, and champs',6.0,25.0,150.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('d43cedf4-a854-44ef-8853-725369212bd6','1942364d-df4e-4175-8210-dbc202ca1038',1704603600,'Add CMS authentication, route protection',6.5,25.0,162.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('fb557beb-9912-4e63-b883-8ff74451062b','1942364d-df4e-4175-8210-dbc202ca1038',1704690000,'Clean up deployment, fix UI/display bugs',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('1383248a-2301-4df4-985d-042cd44c1c49','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1736398800,'Correct rain date and sponsor editor saves',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('dff81591-7781-45a2-b7b4-2e729c15048b','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1736485200,'Fix bugs with article editor and images',4.0,25.0,100.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('01f8a30d-e04e-4ccc-ad18-da918e677ff9','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1736571600,'Add upload event image/compress for load',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('d2f51448-c17c-4dc1-bfb3-09f7af3f9d3a','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1736744400,'Work w/ hotlap to get registration roster',2.0,25.0,50.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('70f9a81a-a4c6-4c78-b80e-0b5a6b0123a0','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1736830800,'Add user management w/ email pwd reset',4.0,25.0,100.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('b06d988c-abb5-40a7-baad-f35878cf11e9','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1736917200,'Finalize code for public, deploy site, bkp old',6.5,25.0,162.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('b6ef7b4b-f43a-472d-abbb-49031e268e88','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737003600,'Add analytics for page views and clicks',4.0,25.0,100.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('4081c2cd-2af2-4283-9e37-5992557666c7','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737090000,'Track System Setup/Shopify (In-person)',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('29a894b6-46c4-4a01-a7c8-4ebe0fc9c0cd','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737176400,'Begin real-time banquet voting system',4.0,25.0,100.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('b8a10fea-3e9b-4885-ae1c-ef222a6584e4','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737435600,'extract/export W9 information for 2024',4.5,25.0,112.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('d78e4072-375c-41e2-8a81-69b7380b9d30','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737522000,'Implement 2024 roster for voting',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('735d00db-dd71-48a2-81dc-d4ab34dc3733','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737608400,'Test and complete deployment of voting',4.5,25.0,112.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('aa9f9359-04a1-4b47-8515-dec844564502','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737694800,'Push and enable banquet voting, fix bugs',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('881a19bf-b655-407d-9a52-1639ce13c5fe','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737781200,'Remove banquet voting, show points tables',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('c07aed16-5c22-4fde-9476-b8a8a7485572','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737867600,'CMS Reconfiguration for SS and MS class',2.5,25.0,62.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('726427ac-a5f0-4c05-9efd-0402fa6e30f0','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1737954000,'Competitors and division page redesign',5.0,25.0,125.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('874a1159-df26-4851-8dc5-d34509b25e77','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1738040400,'Browser conflict tests and fixes',3.5,25.0,87.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('b0fb99d3-9c32-4729-89ce-7aab0ba98256','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1738299600,'Rules CMS Editor upload and edit repair',4.5,25.0,112.5,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('33cda6b9-cdc6-4211-a52f-a6aa9badaf2f','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1738558800,'Migrate backup from BB to DO, sys updates',4.0,25.0,100.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('d1dfaa3d-c880-47c4-b2a8-5e1c61b72ae0','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1738645200,'Create and verify backup scripts',3.0,25.0,75.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('21627b66-05b7-472e-8df6-ddc37554bf3b','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1738731600,'Optimize devenv to use locally hosted S3/DB',2.0,25.0,50.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('271561b0-b8af-4603-aa43-49ba87bc4da6','547569b8-2f7c-486b-a4f1-2a7b80aa904a',1738904400,'Verify integrity of backup change chunks',1.0,25.0,25.0,1752132169,0);
INSERT INTO beenvoice_invoice_item VALUES('f4d05559-46e7-46da-8cf0-00606e63fb49','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1741150800,'Limit event display, update event layout',3.0,25.0,75.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('b7a66b38-1628-46cd-be21-0d9d0f7c105a','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1741579200,'Work w/ cloudflare to inc. file size limit',1.0,25.0,25.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('8a98405f-ff6b-4e64-83aa-25cf2ad0e3cb','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1742097600,'update/fix article saving/loading process',4.0,25.0,100.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('80c17c33-bc48-44e3-b358-73dc7df0b63e','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1742184000,'update/fix rule saving/loading process',2.5,25.0,62.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('d8f3066a-ea93-4221-8d9e-1921fb31d006','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1742270400,'patch Next.JS emerg. security vulnerability',3.0,25.0,75.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('41c658b0-8020-4471-9e8d-e0f67108c9a9','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1742356800,'Update server headers to use new limit',1.5,25.0,37.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('933bad4e-f7da-452c-b8f5-be6d631cbe23','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1742702400,'Add PDF export of events/rules on demand',3.0,25.0,75.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('d204cb6a-be0e-4ee7-8c46-a7f532c7a291','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1742788800,'Add file caching to save $ on server usage',3.0,25.0,75.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('7e172229-4a68-482c-b429-326e228d185e','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1742875200,'Add video upload, begin driver testimonial',4.0,25.0,100.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('19c8f1e4-e676-40c2-ba1a-c370c2491af8','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1742961600,'Disable points section, prep for new points',2.5,25.0,62.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('1c26eeb4-22de-47bd-a170-d003fda1a213','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1743048000,'Finalize testimonial, update/enable points',5.0,25.0,125.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('c5aaf396-c27b-44ac-b141-c69872d87a4d','bd64542e-c576-4dd7-b0d4-f4d6077aef25',1743393600,'Retrieve and display previous itineraries',1.5,25.0,37.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('df365fb2-9d75-4589-83e4-48969e62df5d','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1746244800,'Lineups upload interface finalized/pushed',4.0,25.0,100.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('0a35f2d9-15b1-4d82-9ba1-df27f0024f6f','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1746331200,'Lineup audience display',3.75,25.0,93.75,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('6d6502d2-0f0d-4521-8943-4ae78e5bc7d9','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1746417600,'Lineup mobile display',4.5,25.0,112.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('258f123f-f80b-4920-af38-08bc8d163f5e','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1746849600,'Begin points upload system backend',2.5,25.0,62.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('c517d481-9741-4283-b74c-e61b500cfd2c','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1747108800,'FileMaker points parsing logic',2.0,25.0,50.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('4e5e6815-6b4b-4433-8a52-dafcbcdd7284','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1747195200,'Update spectator policy system',1.5,25.0,37.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('fa70e962-0678-4593-b8fd-8abab5a26c6b','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1747454400,'Restructure lineup page logic for old phone',3.5,25.0,87.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('9e1878f9-f485-408e-91c9-281b02737d3e','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1747540800,'Handle cross time zone errors w/ lineups',2.5,25.0,62.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('8effbfe4-1434-4448-b7a6-5ab316fc93f9','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1747800000,'Crate mod points issue fix',1.0,25.0,25.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('12ea8e17-eac6-42b4-aa22-3981003172a5','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1748404800,'In person, website/network planning',4.5,25.0,112.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('c8bd20a4-19d0-47ca-b381-93bd6e5fd2dc','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1748491200,'Rain date API integration/management',5.0,25.0,125.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('02ce3809-d900-4f1f-9400-64b225d61339','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1748577600,'Begin lineup patches for visibility',4.5,25.0,112.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('8f4d886d-8d3d-4a30-bec7-b41ee854f731','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1748664000,'Bind rain dates to events, show reschedule',5.5,25.0,137.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('6fce0331-9208-408f-8369-4fb4a2fb2fa4','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1748750400,'drag and drop lineups, divisions cms update',4.5,25.0,112.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('6f49db90-fa25-44ab-9ef4-57c00c9c36c3','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1748836800,'home page reordering, QoL improvements',4.5,25.0,112.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('c63d9d91-6e0c-48f8-b2f1-a02c4839848c','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1748923200,'In person, bulk email system',3.5,25.0,87.5,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('61b3faf1-4edc-4b05-9914-45fa8b49b51f','5a8f214c-8f6d-46e9-949e-1e9e31c40974',1748923200,'Remote, bulk email/delta points',3.0,25.0,75.0,1752132170,0);
INSERT INTO beenvoice_invoice_item VALUES('c236b466-5706-4bad-8324-5219c17dd2f2','06c43197-9685-4116-b83b-1c76840905ab',1652500800,'Replay Operator',10.0,40.0,400.0,1752132902,0);
INSERT INTO beenvoice_invoice_item VALUES('772bdeaa-a5a9-4c7e-8a54-d02b6d115e16','a66739ec-fbfe-4871-8388-0b34b2228889',1683777600,'Install and configure tech PCs',2.0,20.0,40.0,1752132902,0);
INSERT INTO beenvoice_invoice_item VALUES('d88ffb8e-4c29-4882-8dff-dd2d227b1639','a66739ec-fbfe-4871-8388-0b34b2228889',1683950400,'Tire shack sales/maintenance',2.0,20.0,40.0,1752132902,0);
INSERT INTO beenvoice_invoice_item VALUES('66eeb92c-ecf3-46c1-b6f6-6569b90fe598','a66739ec-fbfe-4871-8388-0b34b2228889',1684123200,'Tire program/scanning',1.0,20.0,20.0,1752132902,0);
INSERT INTO beenvoice_invoice_item VALUES('8f00b60d-5dc7-4f19-ad3e-2a51d1c4d296','d6a1da99-d066-4993-b907-1e30a769f107',1743652800,'Correct time-zone errs for non-EST viewers',2.0,25.0,50.0,1752274548,0);
INSERT INTO beenvoice_invoice_item VALUES('3ab632b7-cebc-49a0-8f59-9f39db3c9543','d6a1da99-d066-4993-b907-1e30a769f107',1743912000,'WiFi Setup/Security Updates across sites',2.0,25.0,50.0,1752274548,1);
INSERT INTO beenvoice_invoice_item VALUES('a3cc32fd-a0aa-4986-8ec6-91e6572ed13d','d6a1da99-d066-4993-b907-1e30a769f107',1744084800,'Standardize date handling, data utility upd.',3.5,25.0,87.5,1752274548,2);
INSERT INTO beenvoice_invoice_item VALUES('f5009d53-27e0-4104-bde3-afaeb4c924e7','d6a1da99-d066-4993-b907-1e30a769f107',1744776000,'Rephrase/reorganize home page',2.5,25.0,62.5,1752274548,3);
INSERT INTO beenvoice_invoice_item VALUES('d92fb22e-e0fb-4e82-b2f9-27f8eee5a150','d6a1da99-d066-4993-b907-1e30a769f107',1744862400,'Add ability to remove/submit null timeslots',3.0,25.0,75.0,1752274548,4);
INSERT INTO beenvoice_invoice_item VALUES('a2228d31-0c4c-49f7-ba7c-a09eb4dfe2c5','d6a1da99-d066-4993-b907-1e30a769f107',1744948800,'Hostway email contact investigate/upload',2.5,25.0,62.5,1752274548,5);
INSERT INTO beenvoice_invoice_item VALUES('c5dcc389-3fea-4cfa-98eb-2130016be99a','d6a1da99-d066-4993-b907-1e30a769f107',1745035200,'Re-render live schedule, update deps.',4.0,25.0,100.0,1752274548,6);
INSERT INTO beenvoice_invoice_item VALUES('73386e72-750e-4eb1-83de-e239c66102fe','d6a1da99-d066-4993-b907-1e30a769f107',1745467200,'Add rich text editor to site backend',3.5,25.0,87.5,1752274548,7);
INSERT INTO beenvoice_invoice_item VALUES('87aa98a8-131d-49bb-98fb-0460a8dde4ab','d6a1da99-d066-4993-b907-1e30a769f107',1745553600,'Update mobile view, fix rules pagination',2.0,25.0,50.0,1752274548,8);
INSERT INTO beenvoice_invoice_item VALUES('6fe10405-029e-4164-b918-f521d3830818','d6a1da99-d066-4993-b907-1e30a769f107',1745812800,'Lineups backend port from racehub-php',2.0,25.0,50.0,1752274548,9);
INSERT INTO beenvoice_invoice_item VALUES('62f2594f-0d24-405a-989c-2fcb5392a3e6','d6a1da99-d066-4993-b907-1e30a769f107',1745899200,'Update filemaker, add csv export/import',2.5,25.0,62.5,1752274548,10);
INSERT INTO beenvoice_invoice_item VALUES('208eebce-58e5-4d1a-8088-47a516fe39c9','d6a1da99-d066-4993-b907-1e30a769f107',1745985600,'Wireframe/basic lineups user interface',3.5,25.0,87.5,1752274548,11);
INSERT INTO beenvoice_invoice_item VALUES('cf1c9e48-bf50-4083-b482-9338a3c439d0','0c9a6715-70f8-4f83-ab01-a8340773431d',1749096000,'Enhance PointsUpload page',3.5,25.0,87.5,1752278188,0);
INSERT INTO beenvoice_invoice_item VALUES('212d7b08-2d12-449a-a0f9-c4496819b740','0c9a6715-70f8-4f83-ab01-a8340773431d',1749441600,'Handle ties in points section',3.5,25.0,87.5,1752278188,1);
INSERT INTO beenvoice_invoice_item VALUES('0d6d372f-6679-4dea-b78b-03ef0192c1e4','0c9a6715-70f8-4f83-ab01-a8340773431d',1749528000,'Add manipulation of bulk email contact lists',4.0,25.0,100.0,1752278188,2);
INSERT INTO beenvoice_invoice_item VALUES('58dfc4ef-8498-4630-a62f-b5fd20410e6e','0c9a6715-70f8-4f83-ab01-a8340773431d',1749614400,'Add staff list to email system, create new',3.5,25.0,87.5,1752278188,3);
INSERT INTO beenvoice_invoice_item VALUES('513c952b-c0f7-49ee-948d-41e5ca4d6e83','0c9a6715-70f8-4f83-ab01-a8340773431d',1749700800,'Add rain banner functionality to events',4.0,25.0,100.0,1752278188,4);
INSERT INTO beenvoice_invoice_item VALUES('469256a8-8335-48ce-a001-67928accf01c','0c9a6715-70f8-4f83-ab01-a8340773431d',1750046400,'Social Media code of conduct',2.0,25.0,50.0,1752278188,5);
INSERT INTO beenvoice_invoice_item VALUES('30720638-2128-4017-897a-8d635d541246','0c9a6715-70f8-4f83-ab01-a8340773431d',1750219200,'Active status management, event cleanup',3.75,25.0,93.75,1752278188,6);
INSERT INTO beenvoice_invoice_item VALUES('d403fc8d-72d3-4d75-a91e-9b3cf68df820','0c9a6715-70f8-4f83-ab01-a8340773431d',1750305600,'Google/Apple Calendar Sync from events',4.5,25.0,112.5,1752278188,7);
INSERT INTO beenvoice_invoice_item VALUES('217f013d-861a-406e-bd8e-392659f6ba72','0c9a6715-70f8-4f83-ab01-a8340773431d',1750392000,'In person, printers/email/server updates',5.0,25.0,125.0,1752278188,8);
INSERT INTO beenvoice_invoice_item VALUES('52be1c1f-3523-4bc3-a8ab-66902db5e229','0c9a6715-70f8-4f83-ab01-a8340773431d',1750478400,'Race day, Server/Handicapping',6.0,25.0,150.0,1752278188,9);
INSERT INTO beenvoice_invoice_item VALUES('dee51491-b6b1-4038-a641-d4fcdfe42f95','0c9a6715-70f8-4f83-ab01-a8340773431d',1750651200,'Repair sponsors/Plan out permissions',3.5,25.0,87.5,1752278188,10);
INSERT INTO beenvoice_invoice_item VALUES('0bd1bec4-2541-42db-ae38-d86d9bac43d5','0c9a6715-70f8-4f83-ab01-a8340773431d',1750737600,'Backend permissions implementation',5.5,25.0,137.5,1752278188,11);
INSERT INTO beenvoice_invoice_item VALUES('dbcb12d5-9b37-4f65-9275-56d82338601b','0c9a6715-70f8-4f83-ab01-a8340773431d',1750824000,'Frontend permissions/deployment',5.0,25.0,125.0,1752278188,12);
INSERT INTO beenvoice_invoice_item VALUES('2899f8ae-6f76-4f32-8350-09151b3d76ab','0c9a6715-70f8-4f83-ab01-a8340773431d',1750910400,'Plan out and begin migration to races sys',4.5,25.0,112.5,1752278188,13);
INSERT INTO beenvoice_invoice_item VALUES('f6f46a67-83ac-4bb1-b128-82daf0063128','0c9a6715-70f8-4f83-ab01-a8340773431d',1750996800,'Replace eventDivisions with races',5.0,25.0,125.0,1752278188,14);
INSERT INTO beenvoice_invoice_item VALUES('56e676ae-3de1-4039-b3d6-e5da99c5aa0c','0c9a6715-70f8-4f83-ab01-a8340773431d',1751083200,'In person, race day, media, development',8.0,25.0,200.0,1752278188,15);
INSERT INTO beenvoice_invoice_item VALUES('71fb8bc8-ac75-426b-a624-83bbaebbac1c','0c9a6715-70f8-4f83-ab01-a8340773431d',1751169600,'User interface for race editing',5.5,25.0,137.5,1752278188,16);
INSERT INTO beenvoice_invoice_item VALUES('eb64faf3-2a9b-4f66-8dd9-4f39f6a7af05','0c9a6715-70f8-4f83-ab01-a8340773431d',1751256000,'Public user interface for finishes and lineup',5.5,25.0,137.5,1752278188,17);
INSERT INTO beenvoice_invoice_item VALUES('79b80323-6c8a-4562-a274-f9e697b1efe4','0c9a6715-70f8-4f83-ab01-a8340773431d',1751342400,'Production push pt.1',6.0,25.0,150.0,1752278188,18);
INSERT INTO beenvoice_invoice_item VALUES('cd84469d-f608-4edd-9121-4366041fe25a','0c9a6715-70f8-4f83-ab01-a8340773431d',1751428800,'Production database migration',3.0,25.0,75.0,1752278188,19);
INSERT INTO beenvoice_invoice_item VALUES('93d21511-d3f9-4338-8eb4-3233614c4ae0','0c9a6715-70f8-4f83-ab01-a8340773431d',1751774400,'Testing, data entry from old races begin',4.0,25.0,100.0,1752278188,20);
INSERT INTO beenvoice_invoice_item VALUES('e701eb75-8ce0-4194-812a-2a3520487a00','0c9a6715-70f8-4f83-ab01-a8340773431d',1751860800,'Update pricing queries, 2023 races',4.0,25.0,100.0,1752278188,21);
CREATE TABLE `beenvoice_invoice` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`invoiceNumber` text(100) NOT NULL,
	`clientId` text(255) NOT NULL,
	`issueDate` integer NOT NULL,
	`dueDate` integer NOT NULL,
	`status` text(50) DEFAULT 'draft' NOT NULL,
	`totalAmount` real DEFAULT 0 NOT NULL,
	`notes` text(1000),
	`createdById` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer, `taxRate` real NOT NULL DEFAULT 0, `businessId` text(255),
	FOREIGN KEY (`clientId`) REFERENCES `beenvoice_client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`createdById`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO beenvoice_invoice VALUES('76d570fe-bfec-47bd-a7fa-b4ee8133c78e','INV-20210417-131231','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1618617600,1621209600,'paid',220.0,'Imported from CSV: 2021-04-17.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132158,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('61c3d28c-5031-4372-86e3-5bf895411046','INV-20210508-131255','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1620432000,1623024000,'paid',320.0,'Imported from CSV: 2021-05-08.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132159,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('57fcd73a-0876-4e91-9856-0f9c9695fcd1','INV-20210605-131278','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1622851200,1625443200,'paid',300.0,'Imported from CSV: 2021-06-05.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132159,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('555b1f8c-7a57-427f-bea8-ee4a3f2a2bf2','INV-20210714-131301','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1626220800,1628812800,'paid',510.0,'Imported from CSV: 2021-07-14.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132159,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('4fb5d8be-2588-4187-955d-e7643b08619f','INV-20210807-131324','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1628294400,1630886400,'paid',280.0,'Imported from CSV: 2021-08-07.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132160,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('f48104da-1baa-4a70-9d0c-c03f4017f60d','INV-20210825-131337','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1629849600,1632441600,'paid',450.0,'Imported from CSV: 2021-08-25.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132160,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('d0c7c941-d0e4-4d55-b1e5-10ed71f1c9f5','INV-20210921-131348','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1632182400,1634774400,'paid',340.0,'Imported from CSV: 2021-09-21.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132160,1752133428,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('6c4314c7-7bc7-4d8a-9513-59a1ebcfd890','INV-20211201-131360','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1638316800,1640908800,'paid',200.0,'Imported from CSV: 2021-12-01.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132161,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('b018eaca-b4b1-4c96-8e40-2a1ab5211e48','INV-20220422-131373','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1650585600,1653177600,'paid',250.0,'Imported from CSV: 2022-04-22.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132161,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('a0da2a05-5681-46fd-b988-235ec24971e2','INV-20220514-131387','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1652486400,1655078400,'paid',200.0,'Imported from CSV: 2022-05-14.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132162,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('713a368a-f7de-4de8-95dd-2a4a2d626fa1','INV-20220521-131401','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1653091200,1655683200,'paid',540.0,'Imported from CSV: 2022-05-21.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132162,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('fac3b7e2-9816-459c-960e-ac520b3f2cd5','INV-20220607-131419','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1654560000,1657152000,'paid',460.0,'Imported from CSV: 2022-06-07.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132162,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('8704d2fe-8972-4dae-8062-2f5b81e14493','INV-20220630-131436','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1656547200,1659139200,'paid',600.0,'Imported from CSV: 2022-06-30.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132163,1752133428,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('babfc847-b37d-44f2-91a9-4251691c11b4','INV-20220731-131453','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1659225600,1661817600,'paid',820.0,'Imported from CSV: 2022-07-31.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132163,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('89f677fb-ca0f-4d43-9547-d4da77f0f0ba','INV-20230316-131472','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1678924800,1681516800,'paid',520.0,'Imported from CSV: 2023-03-16.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132163,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('2a07bf2e-1923-4b4b-aba9-14c507a2f2c4','INV-20230513-131490','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1683936000,1686528000,'paid',750.0,'Imported from CSV: 2023-05-13.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132164,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('0b057a65-fe7d-4495-8756-4dd61f6895e1','INV-20230521-131513','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1684627200,1687219200,'paid',790.0,'Imported from CSV: 2023-05-21.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132164,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('f86f4002-6539-44a3-b8c9-ca6689f809c1','INV-20230604-131532','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1685836800,1688428800,'paid',1050.0,'Imported from CSV: 2023-06-04.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132164,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('ef6a5079-2d65-46b1-8d87-a9ef5c0cb650','INV-20230611-131552','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1686441600,1689033600,'paid',540.0,'Imported from CSV: 2023-06-11.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132165,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('9da8c49f-f6e5-4e5d-8da6-2c1baaf1e5cb','INV-20230709-131574','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1688860800,1691452800,'paid',800.0,'Imported from CSV: 2023-07-09.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132165,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('9186435f-2b62-4c58-aa45-c00aeac9c7d6','INV-20230717-131599','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1689552000,1692144000,'paid',910.0,'Imported from CSV: 2023-07-17.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132165,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('a722008f-f269-4018-b755-b25cd2c5471a','INV-20230722-131624','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1689984000,1692576000,'paid',720.0,'Imported from CSV: 2023-07-22.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132166,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('ed3cf514-1438-4ee0-8e72-3f47c0f9aa15','INV-20230801-131649','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1690848000,1693440000,'paid',990.0,'Imported from CSV: 2023-08-01.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132166,1752133428,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('c7e84ee9-ae1e-4f31-b120-6cc7e02b0442','INV-20230812-131677','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1691798400,1694390400,'paid',1130.0,'Imported from CSV: 2023-08-12.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132166,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('e18f8253-59a5-45ab-9070-8397930c8e12','INV-20231025-131707','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1698192000,1700787600,'paid',730.0,'Imported from CSV: 2023-10-25.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132167,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('f39a6380-e1c0-4a28-b25e-f960e40ebbdc','INV-20231120-131737','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1700438400,1703030400,'paid',570.0,'Imported from CSV: 2023-11-20.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132167,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('352863b6-4bcd-4060-9aee-7a1493381646','INV-20240110-131769','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1704844800,1707436800,'paid',1150.0,'Imported from CSV: 2024-01-10.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132167,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('dc0e0595-07a8-471b-8f7b-23cd13c0b8c1','INV-20240314-131797','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1710374400,1712966400,'paid',1190.0,'Imported from CSV: 2024-03-14.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132168,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('cf6ea6c8-c485-4a01-aa12-f68306ef426a','INV-20240425-131828','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1714003200,1716595200,'paid',660.0,'Imported from CSV: 2024-04-25.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132168,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('1942364d-df4e-4175-8210-dbc202ca1038','INV-20250108-131858','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1736294400,1738886400,'paid',2100.0,'Imported from CSV: 2025-01-08.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132169,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('547569b8-2f7c-486b-a4f1-2a7b80aa904a','INV-20250207-131897','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1738886400,1741478400,'paid',1925.0,'Imported from CSV: 2025-02-07.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132169,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('bd64542e-c576-4dd7-b0d4-f4d6077aef25','INV-20250402-131932','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1743552000,1746144000,'paid',850.0,'Imported from CSV: 2025-04-02.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132170,1752133428,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('d6a1da99-d066-4993-b907-1e30a769f107','INV-20250501-132029','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1746057600,1748649600,'paid',825.0,'Imported from CSV: 2025-05-01.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132170,1752274548,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('5a8f214c-8f6d-46e9-949e-1e9e31c40974','INV-20250604-132064','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1748995200,1751587200,'paid',1506.25,'Imported from CSV: 2025-06-04.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132170,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('0c9a6715-70f8-4f83-ab01-a8340773431d','INV-20250702-132103','1c17bccd-3bc6-42c2-a500-68728a2a9d25',1751414400,1754006400,'sent',2481.25,'Imported from CSV: 2025-07-02.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132171,1752278188,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('06c43197-9685-4116-b83b-1c76840905ab','INV-1752132853225','8c24c053-9f84-49be-95e3-30fe9cdcdeef',1652500800,1655179200,'paid',400.0,'Imported from CSV: 2022-05-14-NBC.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132902,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
INSERT INTO beenvoice_invoice VALUES('a66739ec-fbfe-4871-8388-0b34b2228889','INV-1752132853250','81edd8a8-c5c7-4f16-ab71-0efedbe3aff7',1684641600,1687320000,'paid',100.0,'Imported from CSV: 2023-05-21-hoosier.csv','1ca66210-7d70-43d1-b01b-07004f566ac8',1752132902,1752133427,0.0,'20ef93d6-b1c4-4f9a-b1c1-e62423770f6b');
CREATE TABLE `beenvoice_session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `beenvoice_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`password` text(255),
	`emailVerified` integer DEFAULT (unixepoch()),
	`image` text(255)
);
INSERT INTO beenvoice_user VALUES('1ca66210-7d70-43d1-b01b-07004f566ac8','Sean O''Connor','sean@soconnor.dev','$2b$12$ntXp5nKRyNyf9HzQFaodVO/yjKHjCW6lG0.MiIH0U74o4y15Jz0Cu',1752122289,NULL);
INSERT INTO beenvoice_user VALUES('08305460-ee86-430b-aa8b-a5280b4a1d5b','Test User','test@example.com','$2b$12$Qh7kl3I0poJCBlitIm9HeumOPCh0zRdgl161KrCyxTNeVi979Lb7C',1752122648,NULL);
CREATE TABLE `beenvoice_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		);
INSERT INTO __drizzle_migrations VALUES(NULL,'01ee87b5282b51988c94170329f6261297481122c93e3c45ac216f0d9a2275f4',1752251358024);
INSERT INTO __drizzle_migrations VALUES(NULL,'6c12a89fdba3169518236b650fa5cbbaff2bff0ac67a4ee5c717295135c1b0a0',1752268902130);
CREATE TABLE IF NOT EXISTS "beenvoice_client" (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(255),
	`phone` text(50),
	`addressLine1` text(255),
	`addressLine2` text(255),
	`city` text(100),
	`state` text(50),
	`postalCode` text(20),
	`country` text(100),
	`createdById` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`createdById`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO beenvoice_client VALUES('81edd8a8-c5c7-4f16-ab71-0efedbe3aff7','Hoosier Tire of Calverton','ar@riverheadraceway.com','(631) 842-7223','1797 Old Country Rd','','Riverhead','NY','11901','','1ca66210-7d70-43d1-b01b-07004f566ac8',1752129038,1752129178);
INSERT INTO beenvoice_client VALUES('1c17bccd-3bc6-42c2-a500-68728a2a9d25','Riverhead Raceway','ar@riverheadraceway.com','(631) 842-7223','1797 Old Country Rd','','Riverhead','NY','11901','United States','1ca66210-7d70-43d1-b01b-07004f566ac8',1752129251,1752129251);
INSERT INTO beenvoice_client VALUES('8c24c053-9f84-49be-95e3-30fe9cdcdeef','TDE, Inc.','tvtimd@aol.com','(413) 575-6125','116 Dowd Ct','','Ludlow','MA','01056','United States','1ca66210-7d70-43d1-b01b-07004f566ac8',1752129474,1752129474);
CREATE TABLE `beenvoice_business` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(255),
	`phone` text(50),
	`addressLine1` text(255),
	`addressLine2` text(255),
	`city` text(100),
	`state` text(50),
	`postalCode` text(20),
	`country` text(100),
	`website` text(255),
	`taxId` text(100),
	`logoUrl` text(500),
	`isDefault` integer DEFAULT false,
	`createdById` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`createdById`) REFERENCES `beenvoice_user`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO beenvoice_business VALUES('20ef93d6-b1c4-4f9a-b1c1-e62423770f6b','Sean O''Connor','sean.oconnor@riverheadraceway.com','(631) 601-6555','14 Washington Avenue','','Miller Place','NY','11764','United States','https://soconnor.dev','','',1,'1ca66210-7d70-43d1-b01b-07004f566ac8',1752277286,1752277286);
CREATE INDEX `account_user_id_idx` ON `beenvoice_account` (`userId`);
CREATE INDEX `invoice_item_invoice_id_idx` ON `beenvoice_invoice_item` (`invoiceId`);
CREATE INDEX `invoice_item_date_idx` ON `beenvoice_invoice_item` (`date`);
CREATE INDEX `invoice_client_id_idx` ON `beenvoice_invoice` (`clientId`);
CREATE INDEX `invoice_created_by_idx` ON `beenvoice_invoice` (`createdById`);
CREATE INDEX `invoice_number_idx` ON `beenvoice_invoice` (`invoiceNumber`);
CREATE INDEX `invoice_status_idx` ON `beenvoice_invoice` (`status`);
CREATE INDEX `session_userId_idx` ON `beenvoice_session` (`userId`);
CREATE INDEX `client_name_idx` ON `beenvoice_client` (`name`);
CREATE INDEX `client_email_idx` ON `beenvoice_client` (`email`);
CREATE INDEX `invoice_item_position_idx` ON `beenvoice_invoice_item` (`position`);
CREATE INDEX `client_created_by_idx` ON `beenvoice_client` (`createdById`);
CREATE INDEX `business_created_by_idx` ON `beenvoice_business` (`createdById`);
CREATE INDEX `business_name_idx` ON `beenvoice_business` (`name`);
CREATE INDEX `business_email_idx` ON `beenvoice_business` (`email`);
CREATE INDEX `business_is_default_idx` ON `beenvoice_business` (`isDefault`);
CREATE INDEX `invoice_business_id_idx` ON `beenvoice_invoice` (`businessId`);
COMMIT;
