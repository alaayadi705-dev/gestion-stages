package com.example.gestionstages;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GestionstagesApplication {

	public static void main(String[] args) {
		org.springframework.context.ConfigurableApplicationContext context = SpringApplication.run(GestionstagesApplication.class, args);
		seedData(context);
	}

	private static void seedData(org.springframework.context.ApplicationContext context) {
		com.example.gestionstages.repository.MinistereRepository minRepo = context.getBean(com.example.gestionstages.repository.MinistereRepository.class);
		com.example.gestionstages.repository.UtilisateurRepository userRepo = context.getBean(com.example.gestionstages.repository.UtilisateurRepository.class);

		// Seed Ministeres
		String[] minNames = {
			"وزارة الشؤون الخارجية","وزارة الشؤون المحلية","وزارة الشؤون الدينية",
			"وزارة الشؤون الاجتماعية","وزارة الفلاحة","وزارة التجارة",
			"وزارة الثقافة","وزارة الدفاع","وزارة الاقتصاد والتخطيط",
			"وزارة التربية","وزارة الطاقة","وزارة التعليم العالي",
			"وزارة البيئة","وزارة التجهيز","وزارة المرأة والأسرة",
			"وزارة المالية","وزارة الوظيفة العمومية","وزارة التكوين المهني",
			"وزارة الصناعة","وزارة الداخلية","وزارة الاستثمار",
			"وزارة الشباب والرياضة","وزارة العدل","وزارة الصحة",
			"وزارة تكنولوجيا الاتصال","وزارة السياحة","وزارة النقل"
		};
		for (String name : minNames) {
			if (minRepo.findByNom(name).isEmpty()) {
				com.example.gestionstages.entity.Ministere m = new com.example.gestionstages.entity.Ministere();
				m.setNom(name);
				minRepo.save(m);
			}
		}

		// Emergency Reset Admin to Plain Text
		String adminEmail = "admin@gmail.com";
		com.example.gestionstages.entity.Utilisateur admin = userRepo.findByEmail(adminEmail).orElse(new com.example.gestionstages.entity.Utilisateur());
		admin.setEmail(adminEmail);
		admin.setPassword("password123"); // CLEAR TEXT
		admin.setRole("ADMIN");
		admin.setNom("Admin");
		admin.setPrenom("System");
		userRepo.save(admin);

		System.out.println(">>> 27 Ministries verified. Admin password reset to PLAIN TEXT 'password123'.");
	}

}
