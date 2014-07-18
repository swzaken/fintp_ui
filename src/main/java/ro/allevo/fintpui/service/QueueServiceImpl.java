package ro.allevo.fintpui.service;

import java.net.URI;
import java.util.ArrayList;

import javax.ws.rs.core.UriBuilder;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import com.sun.jersey.api.client.ClientResponse;

import ro.allevo.fintpui.dao.MessageTypesDao;
import ro.allevo.fintpui.dao.QueueDao;
import ro.allevo.fintpui.exception.NotAuthorizedException;
import ro.allevo.fintpui.model.MessageType;
import ro.allevo.fintpui.model.Queue;
import ro.allevo.fintpui.model.QueueType;
import ro.allevo.fintpui.model.QueueTypes;
import ro.allevo.fintpui.utils.RestClient;
import ro.allevo.fintpui.utils.servlets.ServletsHelper;

public class QueueServiceImpl implements QueueService{

	@Autowired
	QueueDao queueDao;
	
	@Autowired
	MessageTypesDao messageTypesDao;
	
	@Autowired
	ServletsHelper servletsHelper;
	
	
	@Override
	public Queue getQueue(String queueName) {
		return queueDao.getQueue(queueName);
	}
	
	@Override
	public Queue[] getQueueList() {
		return queueDao.getQueueList();
	}
	
	@Override
	public JSONObject getQueueListAsJSON() {
		// TODO Auto-generated method stub
		// TODO : enable pagination (only if needed) 
		return null;
	}

	@Override
	public void insertQueue(Queue queue) {
		queueDao.insertQueue(queue);
	}
	
	
	@Override
	public void updateQueue(String queueName, Queue queue) {
		
		
		queueDao.updateQueue(queueName, queue);
	}
	
	@Override
	public void deleteQueue(String queueName) {
		queueDao.deleteQueue(queueName);
	}

	@Override
	public int getNumberOfMessagesInQueue(String queueName) {
		URI uri = UriBuilder.fromPath(servletsHelper.getUrl()).path("queues")
				.path(queueName).path("messages").queryParam("filter", "t")
				.build();
		ClientResponse response = servletsHelper.getAPIResource(uri);
		switch (response.getStatus()) {
		case 200:
			JSONObject entity = response.getEntity(JSONObject.class);
			try {
				return entity.getInt("total");
			} catch (JSONException e) {
				throw new RuntimeException("Failed : Requested total field but not provided by API");
			}
		case 403:
			return -1;
		case 404:
			return -1;
		default:
			throw new RuntimeException("Failed : HTTP error code : "
					+ response.getStatus() + " => handle this type of response: "
					+ "at GET " + uri);
		}
		
		
	}

	@Override
	public ArrayList<String> getQueueTypes() {
		ArrayList<String> queueTypes = new ArrayList<>();
		RestTemplate client = new RestClient();
		String url = servletsHelper.getUrl() + "/queuetypes";
		QueueTypes  response = client.getForObject(url, QueueTypes.class);
		for(QueueType queueType : response.getQueuetypes()){
			queueTypes.add(queueType.getTypename());
		}
		return queueTypes;
	}

	@Override
	public ArrayList<String> getMessageTypesInQueue(String queueName) {
		
		ArrayList<String> result = new ArrayList<>();
		for(MessageType messageType : messageTypesDao.getMessageTypesInQueue(queueName)){
			if(messageType.getParentmsgtype()!= null){
				result.add(messageType.getParentmsgtype());
			}else{
				result.add(messageType.getMessagetype());
			}
		}
		return result;
		
	}
	@Override
	public ArrayList<Boolean> getIsParrentMessageInQueue(String queueName) {
		ArrayList<Boolean> result = new ArrayList<>();
		for(MessageType messageType : messageTypesDao.getMessageTypesInQueue(queueName)){
			if(messageType.getParentmsgtype()!= null){
				result.add(true);
			}else{
				result.add(false);
			}
		}
		return result;
		
	}
	
	@Override
	public ArrayList<String> getChildMessageTypes(String queueName) {
		
		ArrayList<String> result = new ArrayList<>();
		for(MessageType messageType : messageTypesDao.getMessageTypesInQueue(queueName)){
			if(messageType.getParentmsgtype() != null){
				result.add(messageType.getMessagetype());
				System.out.println(result);
			}else{
				result.add(null);
			}
		}
		return result;
		
	}

	@Override
	public ArrayList<String> getQueuesNames() {
		ArrayList<String> names = new ArrayList<>();
		Queue[] queues = getQueueList();
		for(Queue queue : queues){
			names.add(queue.getName());
		}
		return names;
	}
}
