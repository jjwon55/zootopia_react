package com.aloha.zootopia;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
// import com.aloha.zootopia.ZootopiaApplication; // Removed because the class does not exist

public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		// return application.sources(ZootopiaApplication.class);
		return application;
	}

}
