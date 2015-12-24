<?
require_once('MyConnector.php');
class Accounts{		
	var $_db2;
	var $_db1;
	var $dist ='/dist/';
	var $src = '/demo/dir_test';
	var $https='https://frontdes-wwwss24.ssl.supercp.com';

	
	
	private function db1(){
				if($this->_db1)return $this->_db1;
				$this->_db1=new MyConnector(0);
				return $this->_db1;
	}	
	
	private function getFolder($id){
				$sql='SELECT folder FROM accounts WHERE id='.(int)$id;				
				$result = $this->db1()->getAllAsObj($sql);
				if(count($result)) return $result[0]->folder;
				return 0;
	}
	
	private function db2($folder){
				if($this->_db2) return $this->_db2;
				$this->_db2 = new MyConnector($folder);					
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
				return json_encode($this->start_create());
				break;				
				case 'install';							
				return $this->install();
				break;
				case 'check_install';							
				return $this->check_install();
				break;
				case 'create_admins';				
				$folder  =  $_SERVER['DOCUMENT_ROOT'].$_SESSION['install_folder'];
				return json_encode($this->create_admins(json_decode(file_get_contents("php://input"),$folder)));
				break;
				case 'register';							
				return json_encode($this->register());
				break;
				case 'send_email_notification';		
				$folder  =  $_SERVER['DOCUMENT_ROOT'].$_SESSION['install_folder'];				
				return json_encode($this->send_email_notification($folder));
				break;
				case 'cancel_install';							
				return json_encode($this->cancel_install());
				break;
				case 'delete';							
				return json_encode($this->delete_account($get['id']));
				break;
				case 'get_info';							
				return json_encode($this->get_account_data($get['id']));
				break;	
				case 'create_config';
				return $this->create_config(json_decode(file_get_contents("php://input")));				
				break;				
				/*
				
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
	private function get_account_data($id){
				$out= new stdClass();
				$folder = $this->getFolder($id);				
				if($folder){
						$folder = $_SERVER['DOCUMENT_ROOT'].$folder;
						if(file_exists($folder) || is_dir($folder)){
								$out->success = 'success';
								if(file_exists($folder.'/data/config.json'))$out->config = json_decode(file_get_contents($folder.'/data/config.json'));
								$sql = "SELECT name,email FROM users WHERE role = ?";
								$res = $this->db2($folder)->query($sql,array('admin'));
								$out->admins =  $res;								
						}else{
							$out->error='error';
							$out->result = 'no folder '.$folder;
						}
						
							
						
				}else {
					$out->error='error';
					$out->result = 'no namespace '.$id;
				}
				
				return $out;
	
	}	
		
	private function deleteDirectory($dir){
		
		return rename($dir,$dir.'_'.time());
		//if (DIRECTORY_SEPARATOR == '/') $cmd = "rm -rf $dir";
		//else if (DIRECTORY_SEPARATOR == '\\')$cmd = "rd /s /q $dir";	
			//f($cmd) $res =  shell_exec($cmd);
		//return $cmd.' '.$res;				
	}
	
	private function cancel_install(){	
			$out= new stdClass();
			$id  =  isset($_SESSION['account_id'])?$_SESSION['account_id']:0;
			if($id){					
					$res = $this->delete_account($id);
					$_SESSION['account_id']=0;
					return $res;
					
			}	
			$folder = isset($_SESSION['directories_folder'])?$_SESSION['directories_folder']:0;			
			if($folder){	
				$folder = $_SERVER['DOCUMENT_ROOT'].$folder;
						//f on linux use: rm -rf /dir
						////If on windows use: rd c:\dir /S /Q
				if(file_exists($folder) && is_dir($folder)){				
						$res=$this->deleteDirectory($folder);
						if($res){
							$_SESSION['directories_folder']=0;
							$out->success='folder_removed';
							$out->result = $res;
						}else{
							$out->error='cant_remove_folder';
							$out->result = $folder;							
						}
				}else{
					$out->error='no folder';
					$out->result = $folder;
				}
				
			}else{
				$out->success='no_folder_yet';
				$out->result = 'cancel_install';
			}
			
			return $out;				
	}
	
	private function addStep($step){
		if(!isset($_SESSION['account_steps']) || $_SESSION['account_steps']==0)$_SESSION['account_steps']=$step;
		else{	
			$steps=$_SESSION['account_steps'];
			$ar=explode(',',$steps);
			$ar[] = $step;
			$_SESSION['account_steps'] = implode(',',$ar);	
			}
	}
	private function resetSteps(){
			$_SESSION['account_steps']=0;
	}
	private function getSteps(){
		return isset($_SESSION['account_steps'])?$_SESSION['account_steps']:0;
	}
	
	
	
	private function getInstallConfig(){
			if(isset($_SESSION['install_config'])){
				$filename =  '../temp/'.$_SESSION['install_config'];
				if(file_exists($filename))	return json_decode(file_get_contents($filename));
				return 0;
			}
			return 0;
	}
	private function getInstallFolder(){
		isset($_SESSION['install_folder'])?$_SESSION['install_folder']:0;
	}
	
	
	private function create_config($data){			
			$config = array();
			foreach($data as $item)	$config[$item->id] = $item->value;	
			$config['folder']=$this->dist.$config['namespace'];
			//$config = new stdClass();			
			//$config->folder = $_SESSION['directories_folder'];
			
			$config['server']= 'http://'.$_SERVER['SERVER_NAME'];
			$config['uid']=$_SESSION['directories_userid'];
			$filename = 'cfg_'.$config['uid'].'_'.time().'.json';
			
			$config['filename']=$filename;
			$config['root'] = $_SERVER['DOCUMENT_ROOT'];
			$config['dist'] = $this->dist;
			$config['src'] = $this->src;
			$config['pub'] = '/pub/';
			$config['data']='/data/';
			$config['db'] = 'directories.db';			
			$config['https']='https://frontdes-wwwss24.ssl.supercp.com';
			$config['adminurl']=$config['https'].$config['folder'].'/Admin';
			$config['Admin'] = 'Admin';
			if(isset($config['KioskMobile']) && $config['KioskMobile']) $config['KioskMobile']='KioskMobile';
			if(isset($config['Kiosk1080']) && $config['Kiosk1080']) $config['Kiosk1080'] = 'Kiosk1080';
			if(isset($config['Kiosk1920']) && $config['Kiosk1920']) $config['Kiosk1920'] = 'Kiosk1920';
			
			//$config->kiosksUrls=array();			
			//$kiosks = array('kiosk1920'=>'Kiosk1920','kiosk1080'=>'Kiosk1080');			
			//foreach($kiosks as $key=>$value)if(isset($indexed[$key]) && $indexed[$key])$config->kiosksUrls[]=$value;	
			
				
			$filename = 'cfg_'.$config['uid'].'_'.time().'.json';
			$_SESSION['install_config'] = $filename;
			$out = json_encode($config);			
			$res = file_put_contents('../temp/'.$filename,$out);
			
			if($res){				
				return $out;
			}
			else return 'ERROR CONFIG';				 
	}
	//////////////////////////////////////////////////////////////////////////////////////////
	private function start_create(){
			sleep(3);
			$out= new stdClass();
			if(isset($_SESSION['directories_config'])){
				$out->success='ready';
				$cmd = "git -v";
				$out->result =  shell_exec($cmd);	
			}else{
				$out->error='no_config';
			}		
					
		return $out;
	}
	
	private function install(){			
			$cfg = $this->getInstallConfig();					
			$root = $cfg->root;
			$src = $root.$cfg->src;			 
			$dest = $root.$cfg->folder;
			$_SESSION['install_folder'] = $cfg->folder;
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
	
	private function check_install(){			
			$cfg = $this->getInstallConfig();			
			$ar= array();
			$ar[]=$cfg->pub;
			$ar[]=$cfg->data;
			if($cfg->KioskMobile)$ar[]=$cfg->pub.$cfg->KioskMobile.'.php';
			if($cfg->Kiosk1080)$ar[]=$cfg->pub.$cfg->Kiosk1080.'.php';
			if($cfg->Kiosk1920)$ar[]=$cfg->pub.$cfg->Kiosk1920.'.php';			
			$ar[]=$cfg->pub.$cfg->Admin.'.php';			
			$ar[]=$cfg->data.$cfg->db;
			$errors=array();			
			foreach($ar as $val) {
					if(file_exists($cfg->root.$cfg->folder.$val)){
						
					}
					else $errors[]=$val;					
			}			
			if(count(errors))	return 'missing_files '.implode(',',$errors);	
			 
			$res = file_put_contents($cfg->root.$cfg->folder.$cfg->data.'config.json',json_encode($cfg));
			if($res) return 'INSTALL_SUCCESS';	
			return 'NO CONFIG SAVED';				
	}
		
	private function create_admins($admins,$folder){	
				$out= new stdClass();				
				$db = $this->db2($folder);				
				$sql ='INSERT INTO users (name,email,username,password,sendemail,role) VALUES(?,?,?,?,?,?)';				
				$stmt = $db->prepare($sql);
				if(!$stmt){
						$out->error='prepare';
						$out->result = $db->errorInfo();
						return $out;
				}
				$sendemail = array();
				foreach($admins as $user){
					if($user->sendemail) $sendemail[$user];
					$res = $stmt->execute(array($user->name,$user->email,$user->username,$user->pass,$user->sendemail,'admin'));
					if(!$res) {
						$out->error='insertadmin';
						$out->result = $db->errorInfo();
						return $out;
					}
				}
				if(count($sendemail))$out->success = 'admins_created_email';						
				else	$out->success = 'admins_created';			
				$out->result = implode(',',$names);
				$this->addStep('create_admins');
				return $out;				
	}
	
	private function send_email_notification($folder){
				$out= new stdClass();
				$result=array();
				$out=array();											
				$db = $this->db2($folder);
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
				$folder = $this->getFolder($id);
				
				if($folder){			 
						$sql="UPDATE accounts SET status='del' WHERE id=".(int)$id;
						$res = $this->db1()->deleteRecord($sql);
						if($res){							
							$out->success = 'account_deleted';
							$folder = $_SERVER['DOCUMENT_ROOT'].$folder;
							if(file_exists($folder) && is_dir($folder)) {
								$res = $this->deleteDirectory($folder);
								if($res){								
									$out->result = 'folder_deleted';
									return $out;
								}else{
									$out->result = 'cant_delete'.$folder;
								}
							}else{
								$out->result='no_folder'.$folder;
							}
						}else{
							$out->error='cant_delete';
							$out->result=$id;
						}
				}else {
					$out->error='no_folder';
					$out->result=$id;
				}				
											
				
			return $out;
	}
	
	private function register(){
				$out= new stdClass();
				$root=$_SERVER['DOCUMENT_ROOT'];				
				$folder = $_SESSION['directories_folder'];	
				$id = $_SESSION['directories_userid'];				
				$data = json_decode(file_get_contents('../temp/account'.$id.'.json'));			
		
			foreach($data as $item){				
				if($item->index=='account-name') $name = $item->value;
				else if($item->index=='description') $description = $item->value;
				else if($item->index=='password')$item->value='';
			}
			$res = file_put_contents($root.$folder.'/data/account.json',json_encode($data));
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
			$sql="SELECT * FROM accounts WHERE user_id=".$id." AND status !='del'";		
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
			error_log(date("Y-m-d H:i:s").'    '.$str."\n\r",3,'../logs/errors.log','');
	}
	private function emailError($str){
			$headers = 'From: admin@front-desk.ca' . "\r\n" .'Reply-To: admin@front-desk.ca' . "\r\n" .'X-Mailer: PHP/' . phpversion();
			error_log(date("Y-m-d H:i:s").'  Accounts.php  '.$str,1,'uplight.ca@gmail.com',$headers);
	}
}