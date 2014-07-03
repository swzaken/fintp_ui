package ro.allevo.fintpui.controllers;

import java.util.ArrayList;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import ro.allevo.fintpui.model.Queue;
import ro.allevo.fintpui.model.RoutingRule;
import ro.allevo.fintpui.model.TimeLimit;
import ro.allevo.fintpui.model.TimeLimits;
import ro.allevo.fintpui.service.QueueService;
import ro.allevo.fintpui.service.ServiceMapService;
import ro.allevo.fintpui.service.TimeLimitsService;
import ro.allevo.fintpui.utils.Invariants;
import ro.allevo.fintpui.utils.JdbcClient;
import ro.allevo.fintpui.utils.servlets.ServletsHelper;

@Controller
public class TimeLimitsController {
	@Autowired
	private JdbcClient dbClient;
	
	@Autowired
	private ServletsHelper servletsHelper;
	
	@Autowired
	private TimeLimitsService timeLimitsService;
	
	@Autowired
	private ServiceMapService serviceMapService;

	private static Logger logger = LogManager.getLogger(TimeLimitsController.class
			.getName());
	
	
	/*
	 * DISPLAY
	 */
	@RequestMapping(value = "/timelimits",method = RequestMethod.GET)
	public String printTimelimits(ModelMap model){
		logger.info("/timelimits requested");
		TimeLimit[] timelimits = timeLimitsService.getAllTimeLimits();
		model.addAttribute("timelimits", timelimits);
		model.addAttribute("apiUri", servletsHelper.getUrl());
		return "tiles/timelimits";
	}
	
	/*
	 * INSERT
	 */
	@RequestMapping(value="/addTimelimit", method = RequestMethod.GET)
	public String printRules(ModelMap model, @ModelAttribute("timelimit") TimeLimit timelimit){
		logger.info("/addTimelimits requested");
		model.addAttribute("timelimit", timelimit);
		return "tiles/timelimit_add";
	}
	
	@RequestMapping(value="/timelimits/insert", method = RequestMethod.POST)
	public String insertRule(@ModelAttribute("timelimit") TimeLimit timelimit){
		logger.info("/insert time limit requested");
		timeLimitsService.insertTimeLimit(timelimit);
		
		return "redirect:/timelimits.htm";
	}
	
	/*
	 * DELETE
	 */
	@RequestMapping(value = "timelimits/deleteTimelimit")
	public String deleteTimelimit(@RequestParam("limitname") String limitname){
		logger.info("/delete time limit requested");
		timeLimitsService.deleteTimeLimit(limitname);
		return "redirect:/timelimits.htm";
	}
	
	/*
	 * EDIT
	 */
	@RequestMapping(value="/editTimelimit", method = RequestMethod.GET)
	public String editTimelimit(ModelMap model, @RequestParam(value="limitname") String limitname){
		logger.info("/editTimelimit requested");
		TimeLimit timelimit = timeLimitsService.getTimeLimit(limitname);
		model.addAttribute("timelimit", timelimit);
		return "tiles/timelimit_edit";
	}
	
	@RequestMapping(value = "/timelimits/update", method = RequestMethod.POST)
	public String updateTimelimit(@ModelAttribute("timelimit") TimeLimit timelimit, @RequestParam("limitname") String limitname){
		logger.info("/update time limit requested");
		timeLimitsService.updateTimeLimit(limitname, timelimit);
		return "redirect:/timelimits.htm";
	}
}
