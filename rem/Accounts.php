<?
require_once('DBConnector.php');
class Accounts{		
	var $_db2;
	var $_db1;
	var $dist ='/dist/';
	var $src = '/demo/dir_test';
	
	
	private function db1(){
				if($this->_db1)return $this->_db1;
				$this->_db1=new DBConnector();
				return $this->_db1;
	}	
	
	private function getFolder($id){
				$sql='SELECT folder FROM accounts WHERE id='.(int)$id;				
				$result = $this->db1()->getAllAsObj($sql);
				if(count($result)) return $result[0]->folder;
				return 0;
	}
	
	private function db2($id){
			if($id){
				$foder = $this->getFolder($id);
				if($folder) $this->_db2 = new PDO('sqlite:'.$folder.'/data/directories.db');								
			}			
			return $this->_db2;			
	}
	public function process($cmd,$get,$post){
			//$this->user_id = $_SESSION['directories_userid'];
			switch($cmd[0]){
					case 'server_url':
					$out = new stdClass();
					$out->success = $_SERVER['SERVER_NAME'];
					$out->result='https://frontdes-wwwss24.ssl.supercp.com';
					echo json_encode($out);
				break;
				case 'get_all':
				return json_encode($this->getAll());
				break;
				case 'update':
				return json_encode($this->update($post));
				break;
				case 'check_url':
				return json_encode($this->check_url($get));
				break;	
				case 'create':			
				return json_encode($this->createAccount(json_decode(file_get_contents("php://input"))));
				break;		
				case 'start_create';
				//$_SESSION['account_create'] ='start_create';
				return json_encode($this->start_create());
				break;
				case 'save_data';
				$data = file_get_contents("php://input");					
				return json_encode($this->save_data($data));		
				break;
				case 'install';							
				return $this->install();
				break;
				case 'check_install';							
				return $this->check_install();
				break;
				case 'create_admins';							
				return json_encode($this->create_admins());
				break;
				case 'register';							
				return json_encode($this->register());
				break;
				case 'send_email_notification';							
				return json_encode($this->send_email_notification());
				break;
				case 'cancel_install';							
				return json_encode($this->cancel_install());
				break;
				case 'delete';							
				return json_encode($this->delete_account($get['id']));
				break;
				case 'get_info';							
				return json_encode($this->get_config($get['id']));
				break;
				/*
				case 'get_admins';					
				return json_encode($this->get_admins($get['id']));
				break;
				case 'add_admin';							
				return json_encode($this->add_admin($get['id'],$post));
				break;
				case 'update_admin';							
				return json_encode($this->update_admin($get['id'],$post));
				break;
				case 'delete_admin';							
				return json_encode($this->delete_admin($get['id'],$post));
				break;
				case 'update_config';							
				return json_encode($this->update_config($get['id'],file_get_contents("php://input")));
				break;
				case 'get_config';							
				return $this->get_config($get['id']);
				break;
				*/
				
			}
			
	}
	
	private function save_config($id,$data){
				$out= new stdClass();
				$foder = $this->getFolder($id);
				if($folder){
						$out->success = 'success';
						$out->result = file_put_contents(json_encode($data),$folder.'/data/config.json');
				}else {
					$out->error='error';
					$out->result = 'no id '.$id;
				}
				
				return $out;
	
	}
	private function get_config($id){
				$out= new stdClass();
				$foder = $this->getFolder($id);
				if($folder){
						$out->success = 'success';
						$out->result = file_get_contents($folder.'/data/config.json');
				}else {
					$out->error='error';
					$out->result = 'no namespace '.$id;
				}
				
				return $out;
	
	}
	
	function deleteDirectory2($file){
			$count=0;
			if (file_exists($file)) { 
					//chmod($file, 0777);
				if (is_dir($file)) {  
						$handle = opendir($file);
							while($filename = readdir($handle)) {  
								if ($filename != "." && $filename != "..") $count+= $this->deleteDirectory($file."/".$filename); 						
							}  
						closedir($handle);  
						rmdir($file);  
				}else{  
					$count++;
					unlink($file);  
				}  
			}  
			return $count;
		}
		
	private function deleteDirectory($dir){
		//$cmd;
		//$res;
		return rename($dir,$dir.'_'.time());
		//if (DIRECTORY_SEPARATOR == '/') $cmd = "rm -rf $dir";
		//else if (DIRECTORY_SEPARATOR == '\\')$cmd = "rd /s /q $dir";	
			//f($cmd) $res =  shell_exec($cmd);
		//return $cmd.' '.$res;				
	}
	
	private function cancel_install(){	
			$out= new stdClass();	
			if(isset($_SESSION['account_id']) && $_SESSION['account_id']) {					
					$res = $this->delete_account($_SESSION['account_id']);
					$_SESSION['account_id']=0;
					return $res;
					
			}	
			if(isset($_SESSION['directories_folder'])){	
						//f on linux use: rm -rf /dir
						////If on windows use: rd c:\dir /S /Q
				$out->result =$this->deleteDirectory($_SESSION['directories_folder']);
				$_SESSION['directories_folder']=0;
			}
			$out->success='success';
			return $out;				
	}
	
	private function addStep($step){
		$steps=$_SESSION['account_create'];
		$ar=explode(',',$steps);
		$ar[] = $step;
		$_SESSION['account_create'] = implode(',',$ar);	
	}
	
	private function save_data($data){
			$out= new stdClass();		
			$id = $_SESSION['directories_userid'];
			$res = file_put_contents('account'.$id.'.json',$data);
			sleep(2);
			$data = json_decode(file_get_contents('account'.$id.'.json'));			
			$namespace='temp__';
			foreach($data as $item) if($item->index=='namespace') $namespace= $item->value;			
			
			if($namespace !=='temp__'){
					$this->addStep('save_data');
					$_SESSION['NS']= $namespace;
					$out->success='saved';
					$out->result=$namespace;
					
			}else {
				$out->error='error';
			}			
			
			return $out;
	}
	
	private function start_create(){
			sleep(3);
			$out= new stdClass();
			$_SESSION['account_create']='start_create';
			$out->success='ready';
			//$out->result = file_exists('C:/wamp/www/dist/account3/pub/Kiosk1080.php');
			return $out;
	}
	
	private function install(){			
			$namespace = 0;
			if(isset($_SESSION['NS']))$namespace = $_SESSION['NS'];
			
			if($namespace === 0){				
				return 'namespase error '.$namespace;
			}			
			$root = $_SERVER['DOCUMENT_ROOT'];
			$src = $root.$this->src;			 
			$dest = $root.$this->dist.$namespace;
			$_SESSION['directories_folder'] = $this->dist.$namespace;
			$cmd = "git clone -l  $src $dest";
			$sh = shell_exec($cmd);
			sleep(1);
			$res = file_exists($dest);
			if($res){
				$this->addStep('install');				
				return 'INSTALL_FINISHED';
			}else {		
				return 'error installing application cant create folder ';
			}
			
			return $out;			
	}
	
	
	/*
	private function insertAccount($uitems){	
			$out= new stdClass();
			$name='NAME';
			$description='description';
			$admins=array();
			$status = 'insert';
			$this->user_id;
			$_SESSION['directories_newaccount'] = $uitems;
			
			foreach($uitems as $item){
			if($item->index=='namespace') $namespace= $item->value;
			else if($item->index=='account-name') $name = $item->value;
			else if($item->index=='description') $description = $item->value;			
			}
			$data = json_encode($uitems);
			$ar = array($this->user_id,$namespace,$status,$name,$description,$data);
			$sql="INSERT INTO accounts (user_id,folder,status,name,description,text) VALUES(?,?,?,?,?)";
			$res = $this->db->insertRow($sql,$ar);			
			if($res){
			$out->success='inserted';
			$out->result = $res;
			}
			
	}
	*/
	private function check_install(){
			$out= new stdClass();			
			$id = $_SESSION['directories_userid'];
			$data = json_decode(file_get_contents('account'.$id.'.json'));
			$indexed = array();
			foreach($data as $item)	$indexed[$item->index] = $item->value;			
			
			
			$config = new stdClass();			
			$config->folder = $_SESSION['directories_folder'];
			$config->ns = $_SESSION['NS'];
			$config->uid=$id;
			$config->root = $_SERVER['DOCUMENT_ROOT'];
			$config->pub = '/pub/';
			$config->data='/data/';
			$config->db = 'directories.db';
			$config->adminUrl='Admin.php';
			$config->mobileUrl='KioskMobile.php';
			$config->kiosksUrls=array();			
			$kiosks = array('kiosk1920'=>'Kiosk1920.php','kiosk1080'=>'Kiosk1080.php');			
			foreach($kiosks as $key=>$value)if(isset($indexed[$key]) && $indexed[$key])$config->kiosksUrls[]=$value;			
			
			$ar= array();
			$ar[]=$config->pub;
			$ar[]=$config->data;
			$ar[]=$config->pub.$config->mobileUrl;		
			$ar[]=$config->pub.$config->adminUrl;
			$ar[]=$config->data.$config->db;
			foreach($config->kiosksUrls as $val) $ar[] = $config->pub.$val;	
			
			foreach($ar as $val) {
					if(file_exists($config->root.$config->folder.$val)){
						
					}
					else return 'MISSINF FILE '.$val;					
			}
			 
				file_put_contents($config->root.$config->folder.$config->data.'config.json',json_encode($data));			
			return 'INSTALL_SUCCESS';			
	}
	
	private function create_admins(){
				$out= new stdClass();
				$root = $_SERVER['DOCUMENT_ROOT'];
				$folder  = $_SESSION['directories_folder'];
				$id = $_SESSION['directories_userid'];
				$data = json_decode(file_get_contents('account'.$id.'.json'));

				
				$admins=array();				
				$n=count($data);
				$names=array();
				$sendEmail=array();;
				for($i=0;$i<$n;$i++){					
					if($data[$i]->index=='username'){
						$user = new stdClass();
						$user->email = $data[$i-2]->value; 
						$user->sendemail = $data[$i-3]->value;						
						$user->name = $data[$i-1]->value;
						$names[]=$user->name;
						$user->username= $data[$i]->value;
						$user->pass=$data[$i+1]->value;
						if($user->sendemail)$sendEmail[] = $user; 
						$admins[] = $user;						
					}
				}					
									
				$db = new PDO('sqlite:'.$root.$folder.'/data/directories.db');
				
				$sql ='INSERT INTO users (name,email,username,password,sendemail,role) VALUES(?,?,?,?,?,?)';
				
				foreach($admins as $admin){
					$stmt = $db->prepare($sql);
					if(!$stmt) {
						$out->error='prepare';
						$out->result = $db->errorInfo();
						return $out;
					}
					$res = $stmt->execute(array($user->name,$user->email,$user->username,$user->pass,$user->sendemail,'admin'));
					if(!$res) {
						$out->error='insertadmin';
						$out->result = $db->errorInfo();
						return $out;
					}
				}
				if(count($sendEmail))$out->success = 'admins_created_email';						
				else	$out->success = 'admins_created';			
				$out->result = implode(',',$names);
				$this->addStep('create_admins');
				return $out;
				
				
	}
	
	private function send_email_notification(){
				$out= new stdClass();
				$result=array();
				$out=array();
				$folder  = $_SERVER['DOCUMENT_ROOT'].$_SESSION['directories_folder'];				
				$db=new PDO('sqlite:'.$folder.'/data/directories.db');
				$sql ='SELECT * FROM users';
				$result = $db->query($sql)->fetchAll(PDO::FETCH_OBJ);
				
				$headers = 'From: admin@front-desk.ca' . "\r\n" .'Reply-To: admin@front-desk.ca' . "\r\n" .'X-Mailer: PHP/' . phpversion();
				$message='';
				$names=array();
				$errors= array();
				$success = array();
				foreach($result as $user){
						if($user->sendemail){
							$email= $user->email;
							$username=$user->username;
							$name = $user->name;
							$names[]=$name;
							$text='Hi $name <br/> You are registered as Administrator Kiosks Directories'."\r\n";
							$text.='username: $username '."\r\n";
							if(mail($email ,'Administrator account Kiosk Directories' ,$text,$headers)){
								$success[]=$name;
							  }else {								
								$errors[]=$name;
							}
						}
				}
				
				if(count($errors)){
						$out->error = 'email_error';
						$out->message.=implode(',',$errors);
						$this->log($out->error."\n\r".$out->message);
				}
				if(count($success)){
					$this->addStep('send_email_notification');
					$out->success='email_sent';
					$out->result = implode(',',$names);
				}	
				
				return $out;	
	}
	
	private function delete_account($id){
				$out= new stdClass();
				$sql='SELECT * FROM accounts WHERE id='.(int)$id;	
				$db = $this->db1();
				$result = $db->getAllAsObj($sql);
				if(count($result)){
						$result->success = 'deleted';
						$folder = $result[0]->folder;
						$sql='DELETE FROM accounts WHERE id='.(int)$id;
						$out->result=$db->deleteRecord($sql);
						if(file_exists($folder) && is_dir($folder)) $this->deleteDirectory($folder);
											
				}else $out->error='no such id '.$id;
			return $out;
	}
	
	private function register(){
				$out= new stdClass();				
				$folder = $_SERVER['DOCUMENT_ROOT'].$_SESSION['directories_folder'];	
				$id = $_SESSION['directories_userid'];				
				$data = json_decode(file_get_contents('account'.$id.'.json'));				
		
			foreach($data as $item){				
				if($item->index=='account-name') $name = $item->value;
				else if($item->index=='description') $description = $item->value;
				else if($item->index=='password')$item->value='';
			}
			$res = file_put_contents($folder.'/data/account.json',json_encode($data));
			$status='new';
			$ar = array($id,$folder,$status,$name,$description);
			$sql="INSERT INTO accounts (user_id,folder,status,name,description) VALUES(?,?,?,?,?)";
			$db = $this->db1();
			$result = $db->insertRow($sql,$ar);
			
			if($result){
				$_SESSION['account_id']= $result;
				$this->addStep('registered');
				$out->success='registered';
				$out->result = $result;
			}else{
				$out->error='error_register';
				$out->result=$db->errorInfo();
				$this->log(' register '.$out->result);
				
			}			
			sleep(2);			
			return $out;
	}
		
	private function check_url($get){
				$out= new stdClass();
				$out->success='exists';
				
				$sql='SELECT * FROM accounts WHERE folder=?';
				$ns = 	$get['url'];				
				if(is_numeric(substr($ns,0,1))) $ns='a'.$ns;
				$root = $_SERVER['DOCUMENT_ROOT'];					 
				$dest = $this->dist.$ns;							
				$ar=array($dest);
				$db = $this->db1();
				$result = $db->query($sql,$ar);
				
				if(count($result)===0)	{						
						$out->success='OK';
						$out->result = $this->dist.$ns;
				}else {
					$ns = 'a'.$_SESSION['directories_userid'].'-'.$ns;
					$dest = $this->dist.$ns;
					$ar=array($dest);
					$result = $db->query($sql,$ar);				
					if(count($result)===0){						
							$out->success='ISOK';
							$out->result = $ns;					
					}
				}
				return $out;
				
	}
	
	private function update($data){				
				$id = (int)$data['id'];				
				if($id===0) return $this->insert($data);
				$sql="UPDATE accounts SET name=?,description=? WHERE id=".$id;
				$ar = $this->toArray($data);				
				$out= new stdClass();
				$out->success='updated';
				$db = $this->db1();
				$out->result = $db->updateRow($sql,$ar);
				return $out;				
	
	}
	private function toArray($data){
			$name = isset($data['name'])?$data['name']:'name';
			$description = isset($data['description'])?$data['description']:'description';			
			return array($name,$description);		
	}
	private function getAll(){
		$id = $_SESSION['directories_userid'];
		if($id==1) {
				$out= new stdClass();
				$out->success='welcome';
				$out->message='Please login with another username ';
				return $out;
		}
			$sql="SELECT * FROM accounts WHERE user_id=".$id;		
		return $this->db1()->getAllAsObj($sql);
	}
	/*
	private function insert($data){				
			$sql="INSERT INTO accounts (name,description,user_id) VALUES (?,?,?)";	
				$ar = $this->toArray($data);
				$ar[] = $this->user_id;				
			$out= new stdClass();
			$out->success='inserted';
			$out->result=$this->db->insertRow($sql,$ar);
			return $out;
	
	}
	*/
	private function filterData($data){
		$out = new stdClass();
		foreach($data as $key=>$val)$out->$key = mysql_real_escape_string($val);
		return $out;
	}
	
	private function log($str){
			error_log(date("Y-m-d H:i:s").'    '.$str."\n\r",3,'errors.log','');
	}
	private function emailError($str){
			$headers = 'From: admin@front-desk.ca' . "\r\n" .'Reply-To: admin@front-desk.ca' . "\r\n" .'X-Mailer: PHP/' . phpversion();
			error_log(date("Y-m-d H:i:s").'  Accounts.php  '.$str,1,'uplight.ca@gmail.com',$headers);
	}
}